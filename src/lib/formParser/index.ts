import formidable from 'formidable';
import { IncomingMessage } from 'http';
import { FileError } from 'lib/error';

class FormParser {
    private form;
    constructor() {
        this.form = formidable({
            keepExtensions: true,
            allowEmptyFiles: false,
            multiples: false,
        });
    }

    async parseForm(req: IncomingMessage) {
        try {
            const [fields, files] = await this.form.parse(req);
            const transformedFields: Record<string, string> = {};

            for (const key in fields) {
                if (fields.hasOwnProperty(key)) {
                    const value = fields[key];
                    if (value) {
                        transformedFields[key] = value[0];
                    }
                }
            }
            return { files, fields };
        } catch (error) {
            throw new FileError();
        }
    }
}

export default FormParser;
