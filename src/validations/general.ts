import Base from "@app-entities/base";
import Upload from "@app-entities/upload";
import { BaseEntity, FindOneOptions, FindOptionsWhere } from "typeorm";
import { z, ZodString } from "zod";

export const phone = z.string().regex(/^[1-9]\d{7,14}$/, {
  message: "Value is not a valid mobile phone number",
});

export function entityTransform<
  Z extends typeof BaseEntity,
  T extends keyof FindOptionsWhere<InstanceType<Z>>
>(model: Z, field: T) {
  return async (
    value: FindOptionsWhere<InstanceType<Z>>[T],
    ctx: z.RefinementCtx
  ) => {
    const entity = await model.findOneBy({ [field]: value });

    if (!entity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not Found",
      });

      return z.NEVER;
    }

    return entity as InstanceType<Z>;
  };
}

export const upload = ({ mime, size }: { mime?: string[]; size?: number }) =>
  z.instanceof(File).transform(async (file, ctx) => {
    if (mime && !mime.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mime type of file not allowed",
      });

      return z.NEVER;
    }

    if (size && file.size > size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File size is too large",
      });

      return z.NEVER;
    }

    return await Upload.makeFromFile(file);
  });

export const uuidEntityParam = <
  M extends typeof Base,
  T extends keyof FindOptionsWhere<InstanceType<M>>
>(
  model: M,
  field: T,
  options?: {
    callback?: (validation: ZodString) => ZodString;
    modelOptions?: FindOneOptions<InstanceType<M>>;
  }
) =>
  z
    .object({
      entity: options?.callback
        ? options.callback(z.string().uuid())
        : z.string().uuid(),
    })
    .transform(async ({ entity: value }, ctx: z.RefinementCtx) => {
      const entity = await model.findOne({
        ...((options?.modelOptions as FindOneOptions<Base>) || {}),
        where: {
          [field]: value,
          ...((options?.modelOptions as FindOneOptions<Base>) || {}).where,
        },
      });

      if (!entity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not Found",
        });

        return z.NEVER;
      }

      return entity as InstanceType<M>;
    });
