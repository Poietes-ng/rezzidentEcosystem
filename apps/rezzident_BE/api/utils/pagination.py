"""Global pagination utilities for async SQLAlchemy routes.

Two public APIs:
  - paginated_response()      — async, does the SELECT itself, returns a
                                FastAPI-ready success_response dict.
  - get_pagination_details()  — pure helper, no DB, just computes metadata
                                from a total count you already have.

Design decisions
----------------
* Uses AsyncSession / `await db.execute(select(...))` — never Session.query()
  which blocks the event loop.
* Accepts an optional SQLAlchemy `where` clause (or list of clauses) so callers
  can filter without building the query themselves.
* `order_by` defaults to `model.created_at DESC` matching the old behaviour;
  pass a custom `order_by` expression to override.
* Returns the standard `success_response` envelope so all paginated endpoints
  look identical to the frontend.

Usage
-----
    # Minimal
    return await paginated_response(db=db, model=Bill, skip=skip, limit=limit)

    # With filters
    return await paginated_response(
        db=db, model=Bill, skip=skip, limit=limit,
        filters=[Bill.estate_id == estate_id, Bill.status == "pending"],
    )

    # With custom ordering
    from sqlalchemy import asc
    return await paginated_response(
        db=db, model=User, skip=skip, limit=limit,
        order_by=asc(User.full_name),
    )
"""

from typing import Any

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import ColumnElement

from api.utils.success_response import success_response


async def paginated_response(
    db: AsyncSession,
    model: Any,
    skip: int,
    limit: int,
    filters: list[ColumnElement[bool]] | None = None,
    order_by: Any | None = None,
) -> dict:
    """Execute a paginated SELECT and return a success_response envelope.

    Args:
        db:       Async SQLAlchemy session (from `Depends(get_db)`).
        model:    The SQLAlchemy model class to query.
        skip:     Number of rows to skip (page * limit).
        limit:    Max rows to return per page.
        filters:  Optional list of SQLAlchemy WHERE clauses, e.g.
                  [User.is_deleted == False, User.role == "resident"].
                  All clauses are ANDed together.
        order_by: Optional ORDER BY expression. Defaults to
                  `desc(model.created_at)`.

    Returns:
        A success_response dict with shape:
        {
            "status": true,
            "status_code": 200,
            "message": "Successfully fetched items",
            "data": {
                "items": [...],
                "total": 42,
                "pages": 5,
                "skip": 0,
                "limit": 10,
            }
        }
    """
    # Build base query
    base_query = select(model)
    count_query = select(func.count()).select_from(model)

    if filters:
        for clause in filters:
            base_query = base_query.where(clause)
            count_query = count_query.where(clause)

    # Count total matching rows (separate query — SQLAlchemy can optimise this)
    total: int = (await db.execute(count_query)).scalar_one()

    # Apply ordering and pagination
    sort = order_by if order_by is not None else desc(model.created_at)
    base_query = base_query.order_by(sort).offset(skip).limit(limit)

    results = (await db.execute(base_query)).scalars().all()

    # Compute page count (ceiling division)
    total_pages = (total + limit - 1) // limit if limit > 0 else 0

    # Serialise — convert ORM objects to plain dicts
    items = [
        {
            col.key: getattr(row, col.key)
            for col in row.__table__.columns  # type: ignore[union-attr]
        }
        for row in results
    ]

    return success_response(
        status_code=200,
        message="Successfully fetched items",
        data={
            "items": items,
            "total": total,
            "pages": total_pages,
            "skip": skip,
            "limit": limit,
        },
    )


def get_pagination_details(num_of_items: int, offset: int, limit: int) -> dict:
    """Compute pagination metadata from a count you already have.

    Use this when you've already done the SELECT yourself and just need
    the standard metadata block, e.g.:

        total = await db.scalar(select(func.count()).select_from(User))
        meta = get_pagination_details(total, skip, limit)

    Returns:
        {"limit": 10, "offset": 0, "pages": 5, "total_items": 42}
    """
    total_pages = (num_of_items + limit - 1) // limit if limit > 0 else 0
    return {
        "limit": limit,
        "offset": offset,
        "pages": total_pages,
        "total_items": num_of_items,
    }
