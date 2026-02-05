/**
 * Display name mappings for Zygos bundle size comparison.
 * Extracted for data/presentation separation.
 */

import { translate } from '@docusaurus/Translate';

export const variantNames: Record<string, string> = {
  zygos: translate({ id: 'comparison.bundle.zygos.variant.zygos', message: 'Zygos' }),
  neverthrow: translate({ id: 'comparison.bundle.zygos.variant.neverthrow', message: 'Neverthrow' }),
  "fp-ts": translate({ id: 'comparison.bundle.zygos.variant.fpTs', message: 'fp-ts' }),
};

export const moduleNames: Record<string, string> = {
  result: translate({ id: 'comparison.bundle.zygos.module.result', message: 'Result' }),
  "result-async": translate({ id: 'comparison.bundle.zygos.module.resultAsync', message: 'ResultAsync' }),
  "result-all": translate({ id: 'comparison.bundle.zygos.module.resultAll', message: 'Result + ResultAsync' }),
  safe: translate({ id: 'comparison.bundle.zygos.module.safe', message: 'Safe' }),
  option: translate({ id: 'comparison.bundle.zygos.module.option', message: 'Option' }),
  either: translate({ id: 'comparison.bundle.zygos.module.either', message: 'Either' }),
  task: translate({ id: 'comparison.bundle.zygos.module.task', message: 'Task' }),
  "task-either": translate({ id: 'comparison.bundle.zygos.module.taskEither', message: 'TaskEither' }),
  "full-result": translate({ id: 'comparison.bundle.zygos.module.fullResult', message: 'All Result modules' }),
  "full-fp": translate({ id: 'comparison.bundle.zygos.module.fullFp', message: 'All FP monads' }),
  "full-library": translate({ id: 'comparison.bundle.zygos.module.fullLibrary', message: 'Full library' }),
};
