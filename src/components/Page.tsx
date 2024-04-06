import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus, FaTrash } from "react-icons/fa";

const billSchema = z.array(
  z.object({
    description: z.string().min(3, "Por favor, informe uma descrição válida"),
    amount: z.coerce.number().positive("Por favor, informe um valor válido"), //coerce convert o que é recebido para number
  }),
);

const schema = z
  .object({
    name: z.string().min(3, "Por favor, informe um nome válido"),
    bills: billSchema,
  })
  .refine((fields) => fields.bills.length > 0, {
    path: ["bills"],
    message: "Por favor, informe pelo menos uma conta",
  });

type FormDataProps = z.infer<typeof schema>;

export default function FormPage() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormDataProps>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "bills",
    control,
  });

  const handleSubmitForm = (data: FormDataProps) => {
    console.log(data);
  };
  return (
    <>
      <div className="bg-slate-800 flex flex-col items-center justify-center gap-5 h-screen p-8">
        <h2 className="text-white text-[24px]">Conta em debito</h2>
        <form
          className="bg-slate-600 flex flex-col items-center justify-center p-9 rounded-3xl min-h-[450px] max-h-[1200px] w-4/12 gap-7"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div>
            <input
              className="bg-slate-400 w-64 h-10 rounded-xl placeholder:text-slate-300 p-2 hover:bg-slate-300 hover:placeholder:text-slate-400"
              {...register("name")}
              type="text"
              placeholder="Informe seu nome"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          {fields.map((field, index) => (
            <div className="flex w-8/12 justify-center gap-4" key={field.id}>
              <div className="w-44">
                <input
                  className="bg-slate-400 h-10 w-40 rounded-xl placeholder:text-slate-300 p-2 hover:bg-slate-300"
                  {...register(`bills.${index}.description`)}
                  type="text"
                />
                {errors?.bills && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.bills[index]?.description?.message}
                  </p>
                )}
              </div>
              <div className="w-44">
                <input
                  className="bg-slate-400 w-40 h-10 rounded-xl placeholder:text-slate-300 p-2 hover:bg-slate-300"
                  {...register(`bills.${index}.amount`)}
                  type="number"
                />
                {errors?.bills && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.bills[index]?.amount?.message}
                  </p>
                )}
              </div>
              <button
                className="bg-red-500 p-3 rounded-md w-10 h-10"
                type="button"
                onClick={() => remove(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            className="flex flex-row items-center gap-3 bg-green-500 text-white px-5 py-2 rounded-xl"
            type="button"
            onClick={() =>
              append({
                description: "",
                amount: 0,
              })
            }
          >
            <FaPlus /> Adicionar conta
          </button>
          {errors?.bills && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              {errors.bills?.message}
            </p>
          )}
          <button
            className="bg-blue-600 px-5 py-2 rounded-xl text-white hover:bg-blue-700 transition-all ease-in-out"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
