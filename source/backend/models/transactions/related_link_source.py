from enum import Enum


class RelatedLinkSource(str, Enum):
    DETECTED = "DETECTED"
    MANUAL = "MANUAL"
