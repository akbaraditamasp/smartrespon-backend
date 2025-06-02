import ComplaintPic from "@app-entities/complaint_pic";
import Upload from "@app-entities/upload";
import { In } from "typeorm";
import { z } from "zod";
import { upload } from "./general";

export const composeComplaintValidation = z
  .object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    address: z.string().nonempty(),
    "coordinates[latitude]": z.coerce.number(),
    "coordinates[longitude]": z.coerce.number(),
    "pics[]": z
      .array(
        upload({
          mime: ["image/jpeg", "image/png", "image/webp"],
          size: 3 * 1024 * 1024,
        }).or(z.string().uuid())
      )
      .optional(),
  })
  .transform(async (data) => {
    const pics = await ComplaintPic.find({
      where: {
        id: In(
          (data["pics[]"] || []).filter((item) => !(item instanceof Upload))
        ),
      },
    });
    return {
      title: data.title,
      description: data.description,
      address: data.address,
      coordinates: {
        latitude: data["coordinates[latitude]"],
        longitude: data["coordinates[longitude]"],
      },
      pics: pics.concat(
        (data["pics[]"] || [])
          .filter((item) => item instanceof Upload)
          .map((item) => {
            const pic = new ComplaintPic();
            pic.file = item as Upload;

            return pic;
          })
      ),
    };
  });
