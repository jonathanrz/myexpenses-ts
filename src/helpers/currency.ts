import numbro from "numbro";

function format(value: number) {
  return `$${numbro(value / 100).format({
    thousandSeparated: true,
    mantissa: 2,
  })}`;
}

function parse(value: string) {
  if (!value) return "0";

  return value.replace(/\D/g, "");
}

const Currency = { format, parse };
export default Currency;
