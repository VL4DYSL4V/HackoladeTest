import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnMapper} from "./simple-column-mapper.js";

const baseMapper = new BaseColumnMapper(undefined);
export const ColumnMapper = new SimpleColumnMapper(baseMapper);
