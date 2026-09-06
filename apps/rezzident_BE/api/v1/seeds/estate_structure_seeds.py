"""Estate Structure Templates — Seed Data.

200+ preloaded address structure patterns for Nigerian estates.
Users select from these or request a custom structure.

Each template defines hierarchical address levels.
Level types: text, numeric, alphanumeric, select (with predefined options)

Provenance fields (new):
    structure        — plain-word label of the level sequence, e.g.
                        "Phase, Street, House Number" (matches the naming
                        convention used in the reference naming-structure
                        catalog, for easy cross-checking).
    example_address   — a real or plausible full address string showing
                        what this template produces once the estate's own
                        name is prepended. Illustrative only, not a format
                        string (see `address_format` for that).
    verified          — True if this exact pattern is modeled on a
                        documented, real-world estate's actual address
                        scheme. False if it's a common/generic pattern
                        not tied to one independently confirmed estate.
    source            — plain description of where the pattern comes from:
                        a named real estate for verified=True entries, or
                        a short rationale for verified=False entries.

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
        "structure": "House Number",
        "example_address": "Chevy View Estate, House 14",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "unit_number_only",
        "name": "Unit Number Only",
        "description": "Simple unit numbering: Unit 1, Unit 2, ...",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Unit Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Unit {Unit Number}",
        "structure": "Unit Number",
        "example_address": "Chevy View Estate, Unit 4",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "flat_number_only",
        "name": "Flat Number Only",
        "description": "Simple flat numbering: Flat 1, Flat 2, ...",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Flat Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Flat {Flat Number}",
        "structure": "Flat Number",
        "example_address": "Chevy View Estate, Flat 4",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "lot_number_only",
        "name": "Lot Number Only",
        "description": "Lot-based numbering: Lot 1, Lot 2, ...",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Lot Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Lot {Lot Number}",
        "structure": "Lot Number",
        "example_address": "Chevy View Estate, Lot 4",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "suite_number_only",
        "name": "Suite Number Only",
        "description": "Suite-based numbering: Suite 1, Suite 2, ...",
        "category": "commercial",
        "levels": [
            {"level": 1, "label": "Suite Number", "type": "alphanumeric", "required": True}
        ],
        "address_format": "Suite {Suite Number}",
        "structure": "Suite Number",
        "example_address": "Cedar Court Estate, Suite 4",
        "verified": False,
        "source": "New — serviced-apartment/office-style estates",
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
        "structure": "Street, House Number",
        "example_address": "Chevy View Estate, Freedom Street, House 10",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "street_plot",
        "name": "Street → Plot Number",
        "description": "Street name with plot number",
        "category": "residential",
        "levels": [
            {"level": 1, "label": "Street", "type": "text", "required": True},
            {"level": 2, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Street}, Plot {Plot Number}",
        "structure": "Street, Plot Number",
        "example_address": "Chevy View Estate, Freedom Street, Plot 10",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "street_flat",
        "name": "Street → Flat Number",
        "description": "Street name with flat number",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Street", "type": "text", "required": True},
            {"level": 2, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Street}, Flat {Flat Number}",
        "structure": "Street, Flat Number",
        "example_address": "Chevy View Estate, Freedom Street, Flat 10",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "close_plot",
        "name": "Close → Plot Number",
        "description": "Close with plot number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Close", "type": "text", "required": True},
            {"level": 2, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Close}, Plot {Plot Number}",
        "structure": "Close, Plot Number",
        "example_address": "Admiralty Estate, Admiralty Close, Plot 14",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "block_house",
        "name": "Block → House Number",
        "description": "Block with house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Block {Block}, House {House Number}",
        "structure": "Block, House Number",
        "example_address": "Golden Park Estate, Block C, House 4",
        "verified": False,
        "source": "Generic — block-organized estate with house numbers",
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
        "structure": "Plot Number",
        "example_address": "Chevy View Estate, Plot 4",
        "verified": True,
        "source": "Confirmed in-app option",
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
        "structure": "Area, Plot Number",
        "example_address": "Amuwo Odofin Layout, Plot 22",
        "verified": False,
        "source": "Generic — common where estates sit inside a broader government/private layout referred to as an 'Area'",
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
        "structure": "Block, Flat Number",
        "example_address": "Golden Park Estate, Block C, Flat 4",
        "verified": False,
        "source": "Generic — common low-rise apartment-block pattern without a Floor tier",
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
        "structure": "Block, Floor, Flat Number",
        "example_address": "1004 Estate, Block 3, Floor 5, Flat 12",
        "verified": True,
        "source": "1004 Estate, Victoria Island — documented high-rise block/floor/flat scheme",
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
        "structure": "Block, Unit Number",
        "example_address": "Golden Park Estate, Block C, Unit 4",
        "verified": False,
        "source": "Generic — terrace/duplex clusters organized by block where each unit is its own building",
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
        "structure": "Tower, Floor, Unit Number",
        "example_address": "Eko Atlantic Towers, Tower 2, Floor 12, Unit 4",
        "verified": False,
        "source": "Generic — mega high-rise condo pattern, not tied to one confirmed development",
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
        "structure": "Wing, Floor, Flat Number",
        "example_address": "Parkview Towers, Wing B, Floor 4, Flat 6",
        "verified": False,
        "source": "Generic — Wing-labeled variant of the block/floor/flat pattern",
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
        "structure": "Street Name, House Number",
        "example_address": "Chevy View Estate, Freedom Street, House 10",
        "verified": True,
        "source": "Confirmed in-app option",
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
        "structure": "Close, House Number",
        "example_address": "Admiralty Estate, Admiralty Close, House 14",
        "verified": True,
        "source": "Confirmed in-app option",
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
        "structure": "Crescent, House Number",
        "example_address": "Parkview Estate, Ocean Crescent, House 9",
        "verified": False,
        "source": "Generic — 'Crescent' is a common street type in upscale Lagos/Ikoyi estates",
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
        "structure": "Avenue, House Number",
        "example_address": "Festac Town, 1st Avenue, House 14",
        "verified": True,
        "source": "Confirmed in-app option",
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
        "structure": "Road, House Number",
        "example_address": "Festac Town, 21 Road, House 14",
        "verified": True,
        "source": "Festac Town, Lagos — internal roads referenced this way in real listings",
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
        "structure": "Phase, House Number",
        "example_address": "Chevy View Estate, Phase 1, House 14",
        "verified": False,
        "source": "Generic — simplest phase-organized pattern, no street/block tier",
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
        "structure": "Phase, Street, House Number",
        "example_address": "Chevy View Estate, Phase 1, Elm Street, House 12",
        "verified": True,
        "source": "Confirmed in-app option",
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
        "structure": "Phase, Block, Flat Number",
        "example_address": "Dolphin Estate, Phase 2, Block D, Flat 8",
        "verified": True,
        "source": "Matches Dolphin Estate's documented phase/block scheme",
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
        "structure": "Phase, Block, Floor, Unit Number",
        "example_address": "Dolphin Estate, Phase 2, Block D, Floor 3, Unit 8",
        "verified": False,
        "source": "Extends Dolphin Estate's documented phase/block scheme with a Floor tier, for taller multi-story phased buildings",
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
        "structure": "Zone, House Number",
        "example_address": "Efab Estate, Zone A, House 5",
        "verified": False,
        "source": "Generic — estates that self-label internal sections 'Zone A/B/C' instead of numbered Phases",
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
        "structure": "Zone, Street, House Number",
        "example_address": "Efab Estate, Zone A, Freedom Street, House 5",
        "verified": False,
        "source": "Generic — estates that self-label internal sections 'Zone A/B/C' instead of numbered Phases",
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
        "structure": "Zone, Block, Flat Number",
        "example_address": "Efab Estate, Zone B, Block 3, Flat 12",
        "verified": False,
        "source": "Generic — Zone-labeled variant of the phase/block/flat pattern",
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
        "structure": "Zone, Block, Floor, Flat Number",
        "example_address": "Efab Estate, Zone B, Block 3, Floor 5, Flat 12",
        "verified": False,
        "source": "Generic — Zone-labeled variant of the block/floor/flat pattern for larger multi-zone apartment estates",
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
        "structure": "Area, Plot Number, House Number",
        "example_address": "Amuwo Odofin Layout, Plot 22, House 4",
        "verified": False,
        "source": "Generic — common where estates sit inside a broader government/private layout",
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
        "structure": "Area, Plot Number, Flat Number",
        "example_address": "Amuwo Odofin Layout, Plot 22, Flat 4",
        "verified": False,
        "source": "Generic — common where estates sit inside a broader government/private layout",
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
        "structure": "Area, Street, House Number",
        "example_address": "Amuwo Odofin Layout, Freedom Street, House 4",
        "verified": False,
        "source": "Generic — common where estates sit inside a broader government/private layout",
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
        "structure": "Court, Unit Number",
        "example_address": "Cedar Court Estate, Cedar Court, Unit 4",
        "verified": False,
        "source": "Generic — 'Court' naming used by some serviced-apartment/townhouse developments",
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
        "structure": "Terrace, House Number",
        "example_address": "Golden Park Estate, Rose Terrace, House 6",
        "verified": False,
        "source": "Generic — terrace-row housing developments",
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
        "structure": "Villa Number",
        "example_address": "Chevy View Estate, Villa 4",
        "verified": True,
        "source": "Confirmed in-app option",
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
        "structure": "Cluster, Villa Number",
        "example_address": "Chevy View Estate, Cluster B, Villa 4",
        "verified": False,
        "source": "Generic — villa developments grouped into named/numbered clusters",
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
        "structure": "Street, Duplex Number, Unit",
        "example_address": "Chevy View Estate, Freedom Street, Duplex 3, Unit B",
        "verified": False,
        "source": "Generic — semi-detached duplex units sharing a street address, split by unit",
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
        "structure": "Block, Row, House Number",
        "example_address": "Golden Park Estate, Block C, Row 2, House 6",
        "verified": False,
        "source": "Generic — terrace-row housing organized by block and row",
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
        "structure": "Building, Floor, Suite Number",
        "example_address": "Cedar Court Estate, Cedar Building, Floor 4, Suite 12",
        "verified": False,
        "source": "Generic — used by serviced-apartment/office-residential hybrid buildings",
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
        "structure": "Shop/Unit Number",
        "example_address": "Cedar Court Estate, Shop 4",
        "verified": False,
        "source": "Generic — simple commercial shop numbering",
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
        "structure": "Layout, Plot Number",
        "example_address": "Amuwo Odofin Layout, Plot 22",
        "verified": False,
        "source": "Generic — common government/private layout plot-numbering pattern",
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
        "structure": "Layout, Block, Plot Number",
        "example_address": "Amuwo Odofin Layout, Block C, Plot 22",
        "verified": False,
        "source": "Generic — common government/private layout block/plot-numbering pattern",
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
        "structure": "Close/Crescent, House Number",
        "example_address": "Admiralty Estate, Admiralty Close, House 14",
        "verified": True,
        "source": "Confirmed in-app option (Close variant)",
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
        "structure": "Phase, Close, House Number",
        "example_address": "Chevy View Estate, Phase 1, Palm Close, House 12",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "phase_street_plot",
        "name": "Phase → Street → Plot Number",
        "description": "Phase with street and plot number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Street", "type": "text", "required": True},
            {"level": 3, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, {Street}, Plot {Plot Number}",
        "structure": "Phase, Street, Plot Number",
        "example_address": "Chevy View Estate, Phase 1, Elm Street, Plot 12",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "phase_block_unit",
        "name": "Phase → Block → Unit Number",
        "description": "Phase with block and unit number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Unit Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Block {Block}, Unit {Unit Number}",
        "structure": "Phase, Block, Unit Number",
        "example_address": "Chevy View Estate, Phase 1, Block B, Unit 6",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "phase_zone_plot",
        "name": "Phase → Zone → Plot Number",
        "description": "Phase with zone and plot number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Zone {Zone}, Plot {Plot Number}",
        "structure": "Phase, Zone, Plot Number",
        "example_address": "Chevy View Estate, Phase 1, Zone C, Plot 6",
        "verified": True,
        "source": "Confirmed in-app option",
    },
    {
        "template_id": "avenue_close_plot",
        "name": "Avenue → Close → Plot Number",
        "description": "Avenue with close and plot number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Avenue", "type": "text", "required": True},
            {"level": 2, "label": "Close", "type": "text", "required": True},
            {"level": 3, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "{Avenue}, {Close}, Plot {Plot Number}",
        "structure": "Avenue, Close, Plot Number",
        "example_address": "Festac Town, 1st Avenue, F1 Close, Plot 7",
        "verified": False,
        "source": "Generic — Festac Town-style numbered-avenue + lettered-close layout",
    },
    {
        "template_id": "zone_crescent_house",
        "name": "Zone → Crescent → House Number",
        "description": "Zone with crescent and house number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Crescent", "type": "text", "required": True},
            {"level": 3, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, {Crescent}, House {House Number}",
        "structure": "Zone, Crescent, House Number",
        "example_address": "Parkview Estate, Zone A, Ocean Crescent, House 9",
        "verified": False,
        "source": "Generic — Zone-labeled estate with crescent-style internal streets",
    },
    {
        "template_id": "phase_road_unit",
        "name": "Phase → Road → Unit Number",
        "description": "Phase with road and unit number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Road", "type": "text", "required": True},
            {"level": 3, "label": "Unit Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, {Road}, Unit {Unit Number}",
        "structure": "Phase, Road, Unit Number",
        "example_address": "Chevron Drive Estate, Phase 1, 4th Road, Unit 3",
        "verified": False,
        "source": "Generic — phase-organized estate with numbered roads",
    },
    {
        "template_id": "phase_close_plot",
        "name": "Phase → Close → Plot Number",
        "description": "Phase with close and plot number",
        "category": "gated_community",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Close", "type": "text", "required": True},
            {"level": 3, "label": "Plot Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, {Close}, Plot {Plot Number}",
        "structure": "Phase, Close, Plot Number",
        "example_address": "Kubwa Housing Estate, Phase 4, Close 12, Plot 6",
        "verified": False,
        "source": "Generic — phase + close naming with plot numbers",
    },
    # ── Missing 4-level templates from docx ──
    {
        "template_id": "phase_zone_avenue_house",
        "name": "Phase → Zone → Avenue → House Number",
        "description": "Phase with zone, avenue and house number",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Avenue", "type": "text", "required": True},
            {"level": 4, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Zone {Zone}, {Avenue}, House {House Number}",
        "structure": "Phase, Zone, Avenue, House Number",
        "example_address": "Gwarimpa Estate, Phase 3, Zone 4, 2nd Avenue, House 9",
        "verified": False,
        "source": "Generic — large planned estate with numbered avenues",
    },
    {
        "template_id": "phase_block_floor_flat",
        "name": "Phase → Block → Floor → Flat",
        "description": "Phase with block, floor and flat number",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Floor", "type": "numeric", "required": True},
            {"level": 4, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Block {Block}, Floor {Floor}, Flat {Flat Number}",
        "structure": "Phase, Block, Floor, Flat Number",
        "example_address": "Dolphin Estate, Phase 2, Block D, Floor 3, Flat 8",
        "verified": False,
        "source": "Extends Dolphin Estate's documented phase/block scheme with a Floor tier",
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
        "structure": "Precinct, Block, Unit Number",
        "example_address": "Northgate Gardens, Precinct 2, Block D, Unit 8",
        "verified": False,
        "source": "Generic — Precinct-labeled variant of the phase/block pattern for very large estates",
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
        "structure": "Sector, Street, House Number",
        "example_address": "Efab Estate, Sector A, Freedom Street, House 5",
        "verified": False,
        "source": "Generic — Sector-labeled variant of the zone/phase pattern",
    },
    {
        "template_id": "zone_phase_block_unit",
        "name": "Zone → Phase → Block → Unit",
        "description": "4-level deep large estate",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Unit", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Zone {Zone}, Phase {Phase}, Block {Block}, Unit {Unit}",
        "structure": "Zone, Phase, Block, Unit Number",
        "example_address": "Efab Estate, Zone B, Phase 1, Block D, Unit 3",
        "verified": False,
        "source": "Generic — Zone+Phase combined variant of the phase/block/unit pattern for very large estates",
        # NOTE: previously mislabeled "5-level deep" in its description while only
        # defining 4 levels (Zone, Phase, Block, Unit). Description corrected to
        # match the actual level count. If a genuine 5-tier version is needed
        # (e.g. adding a Floor tier before Unit for a high-rise variant), add a
        # separate template rather than silently expanding this one.
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
        "structure": "Lane, House Number",
        "example_address": "Chevy View Estate, Rose Lane, House 6",
        "verified": False,
        "source": "Generic — Lane-type internal street naming",
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
        "structure": "Compound, Room Number",
        "example_address": "Baba Ade Compound, Room 4",
        "verified": False,
        "source": "Generic — common 'face-me-I-face-you' compound housing pattern in urban Nigeria",
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
        "structure": "Gate, Block, Flat Number",
        "example_address": "Golden Park Estate, Gate 2, Block C, Flat 4",
        "verified": False,
        "source": "Generic — large multi-entrance estates that organize internally by entry gate",
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
        "structure": "Quarter, Block, House Number",
        "example_address": "Sabon Gari Quarter, Block C, House 6",
        "verified": False,
        "source": "Generic — 'Quarter' naming widely used in Northern Nigerian residential areas",
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
        "structure": "House Type, Number",
        "example_address": "Chevy View Estate, Duplex 5",
        "verified": False,
        "source": "Generic — house-type-first numbering used in mixed-housing-type developments",
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
        "structure": "Block, House Type, Number",
        "example_address": "Golden Park Estate, Block C, Duplex 5",
        "verified": False,
        "source": "Generic — block-organized estate with mixed house types per block",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: 5-Level Structures (mega-estates)
    # ────────────────────────────────────────────────
    {
        "template_id": "phase_zone_block_floor_flat",
        "name": "Phase → Zone → Block → Floor → Flat",
        "description": "Full 5-tier hierarchy for large phased high-rise estates",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Floor", "type": "numeric", "required": True},
            {"level": 5, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "Phase {Phase}, Zone {Zone}, Block {Block}, Floor {Floor}, Flat {Flat Number}",
        "structure": "Phase, Zone, Block, Floor, Flat Number",
        "example_address": "Chevy View Estate, Phase 1, Zone B, Block C, Floor 5, Flat 12",
        "verified": False,
        "source": "Logical extension of verified 4-tier patterns for mega-developments",
    },
    {
        "template_id": "district_phase_zone_street_house",
        "name": "District → Phase → Zone → Street → House",
        "description": "District-organized large estate with street addressing",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "District", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Street", "type": "text", "required": True},
            {"level": 5, "label": "House Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "District {District}, Phase {Phase}, Zone {Zone}, {House Number} {Street}",
        "structure": "District, Phase, Zone, Street, House Number",
        "example_address": "Northgate Gardens, District A, Phase 1, Zone C, Bank Street, House 24",
        "verified": False,
        "source": "Logical extension — multi-district mega-development with internal street addressing",
    },
    {
        "template_id": "district_phase_block_floor_flat",
        "name": "District → Phase → Block → Floor → Flat",
        "description": "District-organized high-rise estate",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "District", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Floor", "type": "numeric", "required": True},
            {"level": 5, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "District {District}, Phase {Phase}, Block {Block}, Floor {Floor}, Flat {Flat Number}",
        "structure": "District, Phase, Block, Floor, Flat Number",
        "example_address": "Northgate Gardens, District A, Phase 2, Block D, Floor 3, Flat 8",
        "verified": False,
        "source": "Logical extension — multi-district high-rise mega-development",
    },

    # ────────────────────────────────────────────────
    # CATEGORY: 6-Level Structures (theoretical maximum)
    # ────────────────────────────────────────────────
    {
        "template_id": "district_phase_zone_block_floor_flat",
        "name": "District → Phase → Zone → Block → Floor → Flat",
        "description": "Full 6-tier hierarchy — every tier at once for mega-developments",
        "category": "estate",
        "levels": [
            {"level": 1, "label": "District", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Block", "type": "alphanumeric", "required": True},
            {"level": 5, "label": "Floor", "type": "numeric", "required": True},
            {"level": 6, "label": "Flat Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "District {District}, Phase {Phase}, Zone {Zone}, Block {Block}, Floor {Floor}, Flat {Flat Number}",
        "structure": "District, Phase, Zone, Block, Floor, Flat Number",
        "example_address": "Northgate Gardens, District A, Phase 1, Zone B, Block C, Floor 5, Flat 12",
        "verified": False,
        "source": "Theoretical maximum — every tier at once for exceptionally large multi-district high-rise mega-developments",
    },
    {
        "template_id": "district_phase_zone_tower_floor_unit",
        "name": "District → Phase → Zone → Tower → Floor → Unit",
        "description": "Full 6-tier tower variant for mega high-rise developments",
        "category": "apartment",
        "levels": [
            {"level": 1, "label": "District", "type": "alphanumeric", "required": True},
            {"level": 2, "label": "Phase", "type": "alphanumeric", "required": True},
            {"level": 3, "label": "Zone", "type": "alphanumeric", "required": True},
            {"level": 4, "label": "Tower", "type": "alphanumeric", "required": True},
            {"level": 5, "label": "Floor", "type": "numeric", "required": True},
            {"level": 6, "label": "Unit Number", "type": "alphanumeric", "required": True},
        ],
        "address_format": "District {District}, Phase {Phase}, Zone {Zone}, Tower {Tower}, Floor {Floor}, Unit {Unit Number}",
        "structure": "District, Phase, Zone, Tower, Floor, Unit Number",
        "example_address": "Northgate Gardens, District A, Phase 1, Zone B, Tower 2, Floor 12, Unit 4",
        "verified": False,
        "source": "Theoretical maximum — tower variant for mega high-rise condo developments",
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
            existing.structure = tpl.get("structure")
            existing.example_address = tpl.get("example_address")
            existing.verified = tpl.get("verified", False)
            existing.source = tpl.get("source")
        else:
            # Insert
            record = EstateStructureTemplate(
                template_id=tpl["template_id"],
                name=tpl["name"],
                description=tpl.get("description"),
                category=tpl.get("category"),
                levels=tpl["levels"],
                address_format=tpl.get("address_format"),
                structure=tpl.get("structure"),
                example_address=tpl.get("example_address"),
                verified=tpl.get("verified", False),
                source=tpl.get("source"),
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