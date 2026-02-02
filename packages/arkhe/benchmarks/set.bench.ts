// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { set as setCompatToolkit_ } from 'es-toolkit/compat';
import { set as setLodashEs_ } from 'lodash-es';
import { set as setArkhe_ } from '../../pithos/src/arkhe/object/set';

const setCompatToolkit = setCompatToolkit_;
const setLodashEs = setLodashEs_;
const setArkhe = setArkhe_;

describe('set/dot', () => {
  bench('es-toolkit/compat/set', () => {
    setCompatToolkit({}, 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 1);
  });

  bench('lodash-es/set', () => {
    setLodashEs({}, 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 1);
  });

  bench('arkhe/set', () => {
    setArkhe({}, 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 1);
  });
});

describe('set/array', () => {
  bench('es-toolkit/compat/set', () => {
    setCompatToolkit({}, 'a[0][1][2][3][4][5][6]', 1);
  });

  bench('lodash-es/set', () => {
    setLodashEs({}, 'a[0][1][2][3][4][5][6]', 1);
  });

  bench('arkhe/set', () => {
    setArkhe({}, 'a[0][1][2][3][4][5][6]', 1);
  });
});
