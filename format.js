/*
Utility functions to format numbers, time duration, currency, and hashrate
*/

module.exports.lang = defaultLanguage;
module.exports.duration = formatDuration;
module.exports.number = formatNumber;
module.exports.currency = formatCurrency;
module.exports.hashrate = formatHashrate;
module.exports.percent = formatPercent;

var defaultLanguage = {

	// duration suffixes
	duration: {
		seconds: 's',
		minutes: 'm',
		hours: 'h',
		days: 'd',
		weeks: 'w',
	},

	// numeric scale, items must be sorted in descending order
	numberScale: [
		{ num: 1e+24, suffix: 'Y' }, // Yotta
		{ num: 1e+21, suffix: 'Z' }, // Zetta
		{ num: 1e+18, suffix: 'E' }, // Exa
		{ num: 1e+15, suffix: 'P' }, // Peta
		{ num: 1e+12, suffix: 'T' }, // Tera
		{ num: 1e+9,  suffix: 'G' }, // Giga
		{ num: 1e+6,  suffix: 'M' }, // Mega
		{ num: 1e+3,  suffix: 'k' }, // kilo
		{ num: 1e+0,  suffix: ''  },
		{ num: 1e-3,  suffix: 'm' }, // milli
		{ num: 1e-6,  suffix: 'u' }, // micro
		{ num: 1e-9,  suffix: 'n' }, // nano
		{ num: 1e-12, suffix: 'p' }, // pico
		{ num: 1e-15, suffix: 'f' }, // femto
		{ num: 1e-18, suffix: 'a' }, // atto
		{ num: 1e-21, suffix: 'z' }, // zepto
		{ num: 1e-24, suffix: 'y' }, // yocto
	],

	// currency scale, items must be sorted in descending order
	currencyScale: [
		{ num: 1e+12, suffix: 'T' }, // Trillion
		{ num: 1e+9,  suffix: 'B' }, // Billion
		{ num: 1e+6,  suffix: 'M' }, // Million
		{ num: 1e+3,  suffix: 'k' }, // kilo
	],
}

/*
Format time duration to stirng like "weeks days hours minutes seconds"
Duration is a number of seconds
Options object may contain:
  * `lang`  - localization options, see defaultLanguage object
  * `maxLength` - maximum length of result string
  * `withoutHours`, `withoutMinutes`, `withoutSeconds` boolean flags
*/
function formatDuration(duration, options) {
	options = options || {};
	options.lang = options.lang || defaultLanguage;
	options.withoutHours = options.withoutHours || false;
	options.withoutMinutes = options.withoutMinutes || options.withoutHours;
	options.withoutSeconds = options.withoutSeconds || options.withoutMinutes;

	var components = ['', '', '', '', ''];

	var weeks = Math.floor(duration / 604800);
	components[0] = (weeks > 0) ? weeks + options.lang.duration.weeks : '';
	duration -= weeks * 604800;

	var days = Math.floor(duration / 86400);
	components[1] = (days > 0) ? days + options.lang.duration.days : '';
	duration -= days * 86400;

	var hours = Math.floor(duration / 3600);
	components[2] = (hours > 0 && !options.withoutHours) ? hours + options.lang.duration.hours : '';
	duration -= hours * 3600;

	var minutes = Math.floor(duration / 60);
	components[3] = (minutes > 0 && !options.withoutMinutes) ? minutes + options.lang.duration.minutes : '';

	var seconds = duration - minutes * 60;
	components[4] = (seconds > 0 && !options.withoutSeconds) ? seconds + options.lang.duration.seconds : '';

	var result = components.join(' ').trim();
	if (options.maxLength && result.length > options.maxLength) {
		for (var len = components.length - 1; len > 2; --len) {
			result = components.slice(0, len).join(' ').trim();
			if (result.length <= options.maxLength) {
				break;
			}
		}
	}
	return result;
}

/*
Format number to string with specified precision.
Allowed options:
  * `lang`  - localization options, see defaultLanguage object
  * `prec` - number of digits after decimal dot, default 3
  * `spacedSuffix` - boolean flag to insert space before scale suffix
*/
function formatNumber(number, options, _useCurrencyScale) {
	number = parseFloat(number);
	options = options || {};
	var lang = options.lang || defaultLanguage;
	var scale = _useCurrencyScale ? lang.currencyScale : lang.numberScale;
	if (typeof options.prec === 'undefined') options.prec = 3;

	var n = Math.abs(number);
	if ((!_useCurrencyScale && n > scale[0].num) || n < scale[scale.length - 1].num) {
		if (_useCurrencyScale) {
			if (number < 0.000005) number = number.toString();
			else if (number < 0.0005) number = number.toFixed(8);
			else if (number < 0.05) number = number.toFixed(5);
			else number = number.toFixed(2);
		} else {
			number = number.toFixed(options.prec);
		}
		if (number && options.spacedSuffix) {
			number += ' ';
		}
		return number;
	}

	var prec = Math.pow(10, options.prec);
	var size = scale[0].num;
	for (var i = 0; i < scale.length; ++i) {
		prev_size = size;
		size = scale[i].num;
		if (size <= n) {
			n = Math.round(n * prec / size) / prec;
			if (n === prev_size / size) {
				// n was rounded to previous scale level, use it
				n = 1;
				size = prev_size;
				--i;
			}
			if (options.spacedSuffix) {
				n += ' ';
			}
			n += scale[i].suffix;
			break;
		}
	}

	return number < 0 ? '-' + n : n;
}

/*
Format currency number to string
Allowed options, see formatNumber function:
  * `symbol` - currency symbol added before the number, e.g. $
*/
function formatCurrency(currency, options) {
	options = options || {};
	var result = formatNumber(currency, options, true);
	if (options.symbol) {
		result = options.symbol + ' ' + result;
	}
	return result;
}

/*
Format crypto-currency network hash rate
Allowed options, see formatNumber function:
  * `hashSuffix` - loalized suffix for `hash` word, default 'H'
*/
function formatHashrate(hashrate, options) {
	options = options || {};
	options.spacedSuffix = true;
	return formatNumber(hashrate, options) + (options.hashSuffix || 'H/s');
}

/*
Format percent number
Allowed options, see formatNumber function
*/
function formatPercent(percent, options) {
	options = options || {};
	if (typeof options.prec === 'undefined') {
		options.prec = 2;
	}
	var result = parseFloat(percent).toString();
	var parts = result.split('.');
	if (parts.length === 2) {
		parts[1] = parts[1].substring(0, options.prec);
		result = parts[0];
		if (parseInt(parts[1]) !== 0) {
			result += '.' + parts[1];
		}
	}
	return result + ' %';
}