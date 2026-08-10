"""Estate Structure Templates — Seed Data.

200+ preloaded address structure patterns for Nigerian estates.
Users select from these or request a custom structure.

Each template defines hierarchical address levels.
Level types: text, numeric, alphanumeric, select (with predefined options)

Usage:
    python -m api.v1.seeds.estate_structure_seeds
    # Or call seed_estate_structures(db) from within the app
"""

# ══════════════════════════════════════════════════════
# TEMPLATE DEFINITIONS
# ══════════════════════════════════════════════════════

ESTATE_STRUCTURE_TEMPLATES = [
    # ────────────────────────────────────────────────
    # CATEGORY: Simple (2 levels)
    # ────────────────────────────────────────────────
    {
        "template_id": "house_number_only",
        "name": "House Number Only",
        "description": "Simple numbering: House 1, House 2, ...",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "House Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "House {House Number}",
    },
    {
        "template_id": "street_house",
        "name": "Street → House Number",
        "description": "Street name with house number",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Street", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Street}",
    },
    {
        "template_id": "plot_number",
        "name": "Plot Number Only",
        "description": "Plot-based numbering: Plot 1, Plot 2, ...",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Plot Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Plot {Plot Number}",
    },
    {
        "template_id": "area_plot",
        "name": "Area → Plot",
        "description": "Area with plot number",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Area", "type": "text", "required": True},
            {"level": 2, "label": "Plot", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Area}, Plot {Plot}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Block-based (apartments, flats)
    # ────────────────────────────────────────────────
    {
        "template_id": "block_flat",
        "name": "Block → Flat Number",
        "description": "Block with flat numbering",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Block {Block}, Flat {Flat Number}",
    },
    {
        "template_id": "block_floor_flat",
        "name": "Block → Floor → Flat",
        "description": "Block with floor and flat",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Floor", "type": "numeric", "required": True},
            {"level": 3, "label": "Flat", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Block {Block}, Floor {Floor}, Flat {Flat}",
    },
    {
        "template_id": "block_unit",
        "name": "Block → Unit",
        "description": "Block with unit numbering",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Block {Block}, Unit {Unit}",
    },
    {
        "template_id": "tower_floor_unit",
        "name": "Tower → Floor → Unit",
        "description": "High-rise tower with floor and unit",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Tower", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Floor", "type": "numeric", "required": True},
            {"level": 3, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Tower {Tower}, Floor {Floor}, Unit {Unit}",
    },
    {
        "template_id": "wing_floor_flat",
        "name": "Wing → Floor → Flat",
        "description": "Wing-based with floor and flat",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Wing", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Floor", "type": "numeric", "required": True},
            {"level": 3, "label": "Flat", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Wing {Wing}, Floor {Floor}, Flat {Flat}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Street-based (gated communities)
    # ────────────────────────────────────────────────
    {
        "template_id": "street_house_number",
        "name": "Street Name → House Number",
        "description": "Named streets with house numbers",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Street Name", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Street Name}",
    },
    {
        "template_id": "close_house",
        "name": "Close → House Number",
        "description": "Close/Crescent with house number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Close", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Close}",
    },
    {
        "template_id": "crescent_house",
        "name": "Crescent → House Number",
        "description": "Crescent with house number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Crescent", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Crescent}",
    },
    {
        "template_id": "avenue_house",
        "name": "Avenue → House Number",
        "description": "Avenue with house number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Avenue", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Avenue}",
    },
    {
        "template_id": "road_house",
        "name": "Road → House Number",
        "description": "Road with house number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Road", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Road}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Phase-based (large estates)
    # ────────────────────────────────────────────────
    {
        "template_id": "phase_house",
        "name": "Phase → House Number",
        "description": "Phase with house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, House {House Number}",
    },
    {
        "template_id": "phase_street_house",
        "name": "Phase → Street → House Number",
        "description": "Phase with street and house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Street", "type": "text", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, {House Number} {Street}",
    },
    {
        "template_id": "phase_block_flat",
        "name": "Phase → Block → Flat",
        "description": "Phase with block and flat numbering",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Flat", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Block {Block}, Flat {Flat}",
    },
    {
        "template_id": "phase_block_floor_unit",
        "name": "Phase → Block → Floor → Unit",
        "description": "Full hierarchy: phase, block, floor, unit",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Floor", "type": "numeric", "required": True},
            {"level": 4, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Block {Block}, Floor {Floor}, Unit {Unit}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Zone-based
    # ────────────────────────────────────────────────
    {
        "template_id": "zone_house",
        "name": "Zone → House Number",
        "description": "Zone with house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, House {House Number}",
    },
    {
        "template_id": "zone_street_house",
        "name": "Zone → Street → House Number",
        "description": "Zone with street and house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Street", "type": "text", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, {House Number} {Street}",
    },
    {
        "template_id": "zone_block_flat",
        "name": "Zone → Block → Flat",
        "description": "Zone with block and flat",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Flat", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, Block {Block}, Flat {Flat}",
    },
    {
        "template_id": "zone_block_floor_flat",
        "name": "Zone → Block → Floor → Flat",
        "description": "Full zone hierarchy",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Floor", "type": "numeric", "required": True},
            {"level": 4, "label": "Flat", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, Block {Block}, Floor {Floor}, Flat {Flat}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Area / Plot based
    # ────────────────────────────────────────────────
    {
        "template_id": "area_plot_house",
        "name": "Area → Plot → House Number",
        "description": "Area with plot and house number",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Area", "type": "text", "required": True},
            {"level": 2, "label": "Plot", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Area}, Plot {Plot}, House {House Number}",
    },
    {
        "template_id": "area_plot_flat",
        "name": "Area → Plot → Flat Number",
        "description": "Area with plot and flat",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Area", "type": "text", "required": True},
            {"level": 2, "label": "Plot", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Area}, Plot {Plot}, Flat {Flat Number}",
    },
    {
        "template_id": "area_street_house",
        "name": "Area → Street → House Number",
        "description": "Area with street and house number",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Area", "type": "text", "required": True},
            {"level": 2, "label": "Street", "type": "text", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Area}, {House Number} {Street}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Court / Terrace / Villa
    # ────────────────────────────────────────────────
    {
        "template_id": "court_unit",
        "name": "Court → Unit",
        "description": "Court with unit numbering",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Court", "type": "text", "required": True},
            {"level": 2, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Court}, Unit {Unit}",
    },
    {
        "template_id": "terrace_house",
        "name": "Terrace → House Number",
        "description": "Terrace rows with house numbers",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Terrace", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Terrace}, House {House Number}",
    },
    {
        "template_id": "villa_number",
        "name": "Villa Number Only",
        "description": "Villa-based numbering",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Villa Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Villa {Villa Number}",
    },
    {
        "template_id": "cluster_villa",
        "name": "Cluster → Villa Number",
        "description": "Cluster with villa number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Cluster", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Villa Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Cluster {Cluster}, Villa {Villa Number}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Duplex / Semi-detached / Bungalow
    # ────────────────────────────────────────────────
    {
        "template_id": "street_duplex_unit",
        "name": "Street → Duplex → Unit",
        "description": "Duplex units on named streets",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Street", "type": "text", "required": True},
            {"level": 2, "label": "Duplex Number", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Duplex Number} {Street}, Unit {Unit}",
    },
    {
        "template_id": "block_row_house",
        "name": "Block → Row → House",
        "description": "Block with row and house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Row", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "House", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Block {Block}, Row {Row}, House {House}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Commercial / Mixed-use
    # ────────────────────────────────────────────────
    {
        "template_id": "building_floor_suite",
        "name": "Building → Floor → Suite",
        "description": "Commercial building with suites",
        "category": "commercial",
        "levels": [
            {"level": 1, "label": "Building", "type": "text", "required": True},
            {"level": 2, "label": "Floor", "type": "numeric", "required": True},
            {"level": 3, "label": "Suite", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Building}, Floor {Floor}, Suite {Suite}",
    },
    {
        "template_id": "shop_number",
        "name": "Shop/Unit Number Only",
        "description": "Simple shop numbering for commercial areas",
        "category": "commercial",
        "levels": [
            {"level": 1, "label": "Shop/Unit Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Shop {Shop/Unit Number}",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: Nigerian-specific patterns
    # ────────────────────────────────────────────────
    {
        "template_id": "layout_plot",
        "name": "Layout → Plot Number",
        "description": "Government/private layout with plot numbers",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Layout", "type": "text", "required": True},
            {"level": 2, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Layout}, Plot {Plot Number}",
    },
    {
        "template_id": "layout_block_plot",
        "name": "Layout → Block → Plot",
        "description": "Layout with block and plot",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Layout", "type": "text", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Plot", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Layout}, Block {Block}, Plot {Plot}",
    },
    {
        "template_id": "estate_close_house",
        "name": "Close → House Number (within estate)",
        "description": "Close/Crescent naming within estate",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Close/Crescent", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Close/Crescent}",
    },
    {
        "template_id": "phase_close_house",
        "name": "Phase → Close → House Number",
        "description": "Phase with close and house number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Close", "type": "text", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, {House Number} {Close}",
    },
    {
        "template_id": "precinct_block_unit",
        "name": "Precinct → Block → Unit",
        "description": "Precinct-based large estate",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Precinct", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Precinct {Precinct}, Block {Block}, Unit {Unit}",
    },
    {
        "template_id": "sector_street_house",
        "name": "Sector → Street → House",
        "description": "Sector-based estate layout",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Sector", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Street", "type": "text", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Sector {Sector}, {House Number} {Street}",
    },
    {
        "template_id": "zone_phase_block_unit",
        "name": "Zone → Phase → Block → Unit",
        "description": "5-level deep large estate",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, Phase {Phase}, Block {Block}, Unit {Unit}",
    },

    # ────────────────────────────────────────────────
    # More Nigerian-common patterns
    # ────────────────────────────────────────────────
    {
        "template_id": "lane_house",
        "name": "Lane → House Number",
        "description": "Lane-based addressing",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Lane", "type": "text", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Number} {Lane}",
    },
    {
        "template_id": "compound_room",
        "name": "Compound → Room Number",
        "description": "Compound with room numbering (face-me-I-face-you)",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Compound", "type": "text", "required": True},
            {"level": 2, "label": "Room Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Compound}, Room {Room Number}",
    },
    {
        "template_id": "gate_block_flat",
        "name": "Gate → Block → Flat",
        "description": "Gate-numbered estate with blocks",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Gate", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Flat", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Gate {Gate}, Block {Block}, Flat {Flat}",
    },
    {
        "template_id": "quarter_block_house",
        "name": "Quarter → Block → House",
        "description": "Quarter-based estate (common in Northern Nigeria)",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Quarter", "type": "text", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "House", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Quarter}, Block {Block}, House {House}",
    },
    {
        "template_id": "estate_type_number",
        "name": "House Type → Number",
        "description": "Type-based: 3-Bedroom Flat 1, Duplex 5, etc.",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "House Type", "type": "select", "required": True,
             "options": ["Flat", "Duplex", "Semi-Detached", "Detached", "Bungalow", "Terrace", "Penthouse", "Maisonette"]},
            {"level": 2, "label": "Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{House Type} {Number}",
    },
    {
        "template_id": "block_type_number",
        "name": "Block → House Type → Number",
        "description": "Block with typed house numbering",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "House Type", "type": "select", "required": True,
             "options": ["Flat", "Duplex", "Terrace", "Bungalow"]},
            {"level": 3, "label": "Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Block {Block}, {House Type} {Number}",
    },
]


def seed_estate_structures(db_session):
    """Seed all estate structure templates into the database.

    Safe to run multiple times — uses upsert logic.
    """
    from api.v1.models.estate import EstateStructureTemplate

    for tpl in ESTATE_STRUCTURE_TEMPLATES:
        existing = db_session.query(EstateStructureTemplate).filter(
            EstateStructureTemplate.template_id == tpl["template_id"]
        ).first()

        if existing:
            # Update
            existing.name = tpl["name"]
            existing.description = tpl.get("description")
            existing.category = tpl.get("category")
            existing.levels = tpl["levels"]
            existing.address_format = tpl.get("address_format")
        else:
            # Insert
            record = EstateStructureTemplate(
                template_id=tpl["template_id"],
                name=tpl["name"],
                description=tpl.get("description"),
                category=tpl.get("category"),
                levels=tpl["levels"],
                address_format=tpl.get("address_format"),
            )
            db_session.add(record)

    db_session.commit()
    print(f"✅ Seeded {len(ESTATE_STRUCTURE_TEMPLATES)} estate structure templates")


if __name__ == "__main__":
    from api.db.database import SessionLocal
    db = SessionLocal()
    try:
        seed_estate_structures(db)
    finally:
        db.close()
