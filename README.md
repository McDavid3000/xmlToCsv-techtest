# Postmortem Readme

## What was done

- Full program requirements delivered
- XML file read in
- Data processed and checked according to specifications
- CSV file written and named accordingly, with header and trailer
- Tested manually

## What wasn't done

- Automated tests

## What would be done with more time

- Automated testing of processData.js especially
- Refactor processData.js into a class
- Improve error handling and reporting. Currently just using console logs.
- Program currently fails if even just one data block is invalid. Depending on business requirements, this could be changed to simply discard/report the invalid block and continue writing valid blocks
- Currently iterating over data numerous times througout program. This could be made more efficient.
- Data currently checked right before file write. Ideally the program would catch invalid data before getting this far.
- CSV file may not be entirely as per technical specifications. Would check this.
