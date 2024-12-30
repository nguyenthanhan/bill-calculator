const fs = require("fs");

const calculateIndividualPrices = (data) => {
  let infos = [];

  const lines = data.split("\n").filter((line) => line.trim() !== "");

  lines.slice(0, -3).forEach((line) => {
    const [name, price, debt] = line.split(",").map((item) => item.trim());

    const priceArr = price.split("+").map((item) => item.trim());
    const originalPrice = priceArr.map((i) => (i ? parseFloat(i) : 0));
    const parsedDebt = debt ?? "";

    if (infos.findIndex((i) => i.name === name) > -1) {
      console.warn("Duplicate name");
    }

    infos = [...infos, { name, originalPrice, debts: parsedDebt }];
  });

  const fee = parseFloat(lines[lines.length - 1].split(":")[1].trim());
  const bill = sumFromString(lines[lines.length - 2].split(":")[1].trim());

  const totalPrices = infos
    .flatMap((item) => item.originalPrice)
    .reduce((acc, price) => acc + price, 0);

  if (bill >= totalPrices) {
    console.warn("wrong bill, please check");
  }

  const parsedInfos = infos.map((info, i) => {
    const { originalPrice, debts, name } = info;

    if (debts === "" && originalPrice[0] === 0) {
      return { ...info, text: null };
    }

    // if (name === "Heimer") {
    //   return { ...info, text: null };
    // }

    const individualPrice = originalPrice.map((price) =>
      price === 0 ? 0 : ((price / totalPrices) * bill).toFixed(2)
    );

    const individualPriceCeil = individualPrice.map((price) =>
      price === 0 ? 0 : Math.ceil(parseFloat(price) + fee)
    );

    const _sum =
      (debts === "" && individualPriceCeil.length === 1) ||
      (debts !== "" && !debts.includes("+") && individualPriceCeil[0] === 0)
        ? ""
        : sumFromString(individualPriceCeil.join("+")) + sumFromString(debts);

    const description = originalPrice
      .map((price, index) =>
        price
          ? `${price} ${
              price
                ? `discount ${(price - individualPrice[index]).toFixed(2)} (${(
                    ((price - individualPrice[index]) / price) *
                    100
                  ).toFixed(2)}%)`
                : 0
            } = ${individualPrice[index]}`
          : ""
      )
      .join(" \n");

    const text = `@${name} ${
      individualPriceCeil[0] === 0 ? `` : `${individualPriceCeil.join("k+")}k`
    }${
      debts === "" || originalPrice[0] === 0 || sumFromString(debts) == 0
        ? ""
        : "+"
    }${debts}${_sum === "" ? "" : ` = ${_sum}k`}`;

    return {
      ...info,
      description,
      discountPrice: individualPriceCeil,
      text,
    };
  });
  console.log("parsedInfos", parsedInfos);

  const parsedInfosString = parsedInfos
    .filter((i) => i.text && i.name !== "Heimer")
    .map((i) => i.text)
    .join("\n");

  pbcopy(parsedInfosString);

  return parsedInfosString;
};

const pbcopy = (data) => {
  var isMacOs = process.platform === "darwin";
  if (!isMacOs) {
    return;
  }
  var proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
};

const sumFromString = (_string) => {
  return (_string.match(/-?\d+(?:,\d{3})*(?:\.\d+)?/g) || []).reduce(
    (sum, value) => sum + parseFloat(value.replace(/,/g, "")),
    0
  );
};

const data = fs.readFileSync("data.txt", "utf8");

const result = calculateIndividualPrices(data);
console.log("\n");
console.log(result);
console.log("\n");
console.log("Copied to clipboard");
