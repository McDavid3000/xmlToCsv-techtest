# Postmortem Readme

## What was done

- Full program requirements delivered
- XML file read in
- Data processed and checked according to specifications
- CSV file written and named accordingly, with header and trailer
- Automated tests written for ProcessData class
- Tested manually

## What wasn't done

## What would be done with more time

- Improve error handling and reporting to be more granular i.e. report specific issues with respect to data.
- Program currently fails if even just one data block is invalid. Depending on business requirements, this could be changed to simply discard/report the invalid block and continue writing valid blocks
- Currently iterating over data numerous times throughout program. This could be made more efficient, although maybe at the cost of code readability and modularity.
- Data currently checked right before file write. Ideally the program would catch invalid data before getting this far.
- Investigate a more direct way of reading and processing XML that does not require conversion to JSON and/or array
- Investigate other testing suites
- Review variable names to ensure consistent conventions
