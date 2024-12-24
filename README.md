# Bill Calculator

A command-line utility for calculating bill splits and managing shared expenses.

## Description

Bill Calculator helps manage shared expenses by calculating individual portions of bills including fees and debts. Built for easy command-line usage with data file support.

## Installation

No need

## Usage

1. Change a data file (data.txt) with bill information:

```txt
Alice, 100
Bob, 50
Bill: 150
Fee: 15
```

2. Run calculator:

```bash
yarn start
```

3. Reset for new calculation:

```bash
yarn reset
```

## Features

- Split bills among multiple people
- Handle individual contributions
- Calculate fees and discounts
- Track running debts
- Auto-copy results (macOS)
- Data file persistence

## File Structure

- `index.js` - Core calculation logic
- `cli.js` - Command line interface
- `data.txt` - Bill data storage
- `package.json` - Project configuration

## License

MIT License
