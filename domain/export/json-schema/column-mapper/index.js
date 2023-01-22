import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnMapper} from "./simple-column-mapper.js";
import {SampledStringColumnMapper} from "./sampled-string-column-mapper.js";

const baseMapper = new BaseColumnMapper(undefined);
const textMapper = new SampledStringColumnMapper(baseMapper);
const simpleMapper = new SimpleColumnMapper(textMapper);

export const ColumnMapper = simpleMapper;
