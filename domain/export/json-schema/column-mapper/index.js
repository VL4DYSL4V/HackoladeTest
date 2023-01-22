import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnMapper} from "./simple-column-mapper.js";
import {SampledStringColumnMapper} from "./sampled-string-column-mapper.js";
import {ArrayColumnMapper} from "./array-column-mapper.js";
import {FrozenColumnMapper} from "./frozen-column-mapper.js";
import {SetColumnMapper} from "./set-column-mapper.js";

const baseMapper = new BaseColumnMapper(undefined);
const setMapper = new SetColumnMapper(baseMapper);
const arrayMapper = new ArrayColumnMapper(setMapper);
const frozenMapper = new FrozenColumnMapper(arrayMapper);
const textMapper = new SampledStringColumnMapper(frozenMapper);
const simpleMapper = new SimpleColumnMapper(textMapper);

export const ColumnMapper = simpleMapper;
