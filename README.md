# wunder-bar

Have you ever wanted to print some pretty bar charts in your terminal? Then this
library is for you!

Wunderbar can print horisontal bar chart with legend and chart scale straight to
your terminal. Or you can use it as a module in your code and get all the
building blocks to print chart yourself.

## Use in terminal

```
npm i -g wunder-bar
echo "[1, 2, 3, 4, 5]" | wunder-bar --min 0
```

![wunder-bar-simple]('./wunder-bar-simple.png')

```
cat data.json | wunder-bar --min 0
```

![wunder-bar-cli]('./wunder-bar-cli.png')

```
cat data.json | wunder-bar --min 0 --sort min --view condensed
```

![wunder-bar-cli-condensed]('./wunder-bar-cli-condensed.png')

## Use in your code

```
npm i --save wunder-bar
```

```js
const wunderbar = require('wunder-bar');
const data = require('./data.json');

const printData = () => {
  const { chart, legend, scale, __raw } = wunderbar(data, {
    min: 0,
    length: 42,
  });

  console.log();
  console.log(chart);
  console.log();
  console.log(scale);
  console.log();
};

printData();
```

## Limitations

* Wunderbar supports only node >= 8

* Wunderbar uses [`chalk.hex`][1] to add color to your charts. Chalk is pretty
  smart to downgrade the color if it is not supported by your terminal, but
  output may vary in different terminals.

* `"condensed"` chart view uses half box symbols to squash two chart bars to one
  line. Quality of the outbut is heavily dependant on your terminal font
  settings. **Use with caution**

[1]: https://github.com/chalk/chalk#256-and-truecolor-color-support
[2]: https://github.com/davidmerfield/randomColor#options
