from pydantic import BaseModel

class ParseRequest(BaseModel):
    text: str
    # The browser's local date, because the server's is UTC. Without it, anyone
    # entering "coffee today" after 8pm Eastern gets tomorrow's date. Optional so
    # a caller that omits it still works, just with the server's idea of today.
    today: str | None = None

class ParsedTransaction(BaseModel):
    amount: str | None = None
    description: str | None = None
    merchant: str | None = None
    category_id: str | None = None
    transaction_date: str | None = None

class ParseResponse(BaseModel):
    transactions: list[ParsedTransaction]
