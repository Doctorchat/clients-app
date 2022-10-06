import moment from "moment";

import "moment/locale/ro";
import "moment/locale/ru";
import "moment/locale/en-gb";

import getActiveLng from "./getActiveLng";

moment.locale(getActiveLng());

export default moment;
