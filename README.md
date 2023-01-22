# Stuff that I'd do if I had more time

- JSON schema column mappers are not versioned. For example:
  - Database UUID type is always a string although in the latest draft there's a special 'uuid' type
  - Date, time, duration and other time-related stuff have special types in some draft versions
##### Can be solved by adding a simple if statement to JSON Schema Mapper's suppliers
- Cross-referencing all the column samples to build a better model for strings. I'd take 100 random entries 
from the database and:
  - If at least 1 is not a JSON -> map it to simple string
  - If all are JSON:
    1. Compute "distance" between objects - if they are "too different", then map to a simple string
    2. If they are "close", build a JSON Schema that would describe all the samples
