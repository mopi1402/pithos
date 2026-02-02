// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { truncate as truncateCompatToolkit_ } from 'es-toolkit/compat';
import { truncate as truncateLodashEs_ } from 'lodash-es';
import { truncate as truncateArkhe_ } from '../../pithos/src/arkhe/string/truncate';

const truncateCompatToolkit = truncateCompatToolkit_;
const truncateLodashEs = truncateLodashEs_;
const truncateArkhe = truncateArkhe_;

const strAsciiShort = 'Hello, world!';
const strAsciiLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
const strUnicodeShort = '안녕하세요, 세계! 🌍🌎🌏';
const strUnicodeLong = '안녕하세요, 세계! 🌍🌎🌏 '.repeat(100);

describe('truncate/short ascii', () => {
  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strAsciiShort);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strAsciiShort);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strAsciiShort);
  });
});

describe('truncate/long ascii', () => {
  const options = { length: 150 };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strAsciiLong, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strAsciiLong, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strAsciiLong, options);
  });
});

describe('truncate/short unicode', () => {
  const options = { length: 28 };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strUnicodeShort, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strUnicodeShort, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strUnicodeShort, options);
  });
});

describe('truncate/long unicode', () => {
  const options = { length: 24, separator: ', ' };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strUnicodeLong, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strUnicodeLong, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strUnicodeLong, options);
  });
});

describe('truncate/noop short ascii', () => {
  const options = { length: 100 };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strAsciiShort, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strAsciiShort, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strAsciiShort, options);
  });
});

describe('truncate/noop long ascii', () => {
  const options = { length: 1_000_000 };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strAsciiLong, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strAsciiLong, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strAsciiLong, options);
  });
});

describe('truncate/noop short unicode', () => {
  const options = { length: 100 };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strUnicodeShort, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strUnicodeShort, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strUnicodeShort, options);
  });
});

describe('truncate/noop long unicode', () => {
  const options = { length: 1_000_000 };

  bench('es-toolkit/compat/truncate', () => {
    truncateCompatToolkit(strUnicodeLong, options);
  });

  bench('lodash-es/truncate', () => {
    truncateLodashEs(strUnicodeLong, options);
  });

  bench('arkhe/truncate', () => {
    truncateArkhe(strUnicodeLong, options);
  });
});
