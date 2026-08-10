from typing import Any, Dict, List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import desc

from api.utils.success_response import success_response


def paginated_response(
    db: Session,
    model,
    skip: int,
    limit: int,
    join: Optional[Any] = None,
    filters: Optional[Dict[str, Any]] = None,
):
    """Custom response for pagination.

    This takes in arguments:
        * db - the database session
        * model - the database table model eg User, Bill
        * limit - number of items to fetch per page (query parameter)
        * skip - number of items to skip before fetching (query parameter)
        * join - optional table to join the query
        * filters - optional dictionary of filters to apply

    Example use:
        **Without filter**
        ```python
        return paginated_response(db=db, model=Bill, limit=limit, skip=skip)
        ```

        **With filter**
        ```python
        return paginated_response(
            db=db, model=Bill, limit=limit, skip=skip,
            filters={'status': 'pending'}
        )
        ```
    """

    query = db.query(model)

    if join is not None:
        query = query.join(join)

    if filters and join is None:
        for attr, value in filters.items():
            if value is not None:
                column = getattr(model, attr)

                if isinstance(column.type, bool):
                    query = query.filter(column == value)
                elif isinstance(column.type, str):
                    query = query.filter(column.like(f"%{value}%"))
                else:
                    query = query.filter(column == value)

    elif filters and join is not None:
        for attr, value in filters.items():
            if value is not None:
                query = query.filter(
                    getattr(getattr(join, "columns"), attr).like(f"%{value}%")
                )

    total = query.count()
    results = query.order_by(desc(model.created_at)).offset(skip).limit(limit).all()
    items = jsonable_encoder(results)

    try:
        total_pages = int(total / limit) + (total % limit > 0)
    except Exception:
        total_pages = int(total / limit)

    return success_response(
        status_code=200,
        message="Successfully fetched items",
        data={
            "pages": total_pages,
            "total": total,
            "skip": skip,
            "limit": limit,
            "items": items,
        },
    )


def get_pagination_details(num_of_items, offset, limit):
    total_pages = int(num_of_items / limit) + (num_of_items % limit > 0)
    return {
        "limit": limit,
        "offset": offset,
        "pages": total_pages,
        "total_items": num_of_items,
    }
