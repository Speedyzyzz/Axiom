# Failure & Chaos Testing

## Chaos Mode
- **DB Disconnect**: System handles missing tables via standard exceptions. Consider adding graceful fallback JSON responses.
- **API Key Missing**: Confirmed fallback to `ENGINE_ONLY` works perfectly under heavy load.
