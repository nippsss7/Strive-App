import DataUriParser from "datauri/parser.js";
import path from 'path';

const parser = new DataUriParser();

const getDataUriDP = (buffer, originalname) => {
    const extName = path.extname(originalname).toString();
    return parser.format(extName, buffer).content;
}

export default getDataUriDP;