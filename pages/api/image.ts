import { withHandler } from "@libs/withHandler";
import axios from "axios";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fileData = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      return resolve(files);
    });
  });

  const formData = new FormData();
  //@ts-ignore
  const file = fileData.file;
  const readStream = fs.createReadStream(file.filepath);

  formData.append("image", readStream);

  const imageResponse = await axios(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=" + formData.getBoundary(),
      },
      data: formData,
    }
  );
  const {
    data: {
      data: { url },
    },
  } = imageResponse;

  res.json({ ok: true, uploadURL: url });
}

export default withHandler({ method: ["POST"], fn: handler, isSession: false });
