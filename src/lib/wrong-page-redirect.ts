import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { redirect } from "next/navigation";

export function checkIfRedirect(
  count: number,
  params: {
    page: number;
  }
) {
  if (count > 0) {
    const totalPages = Math.ceil(count / DEFAULT_PAGE_SIZE);

    const correctedPage =
      params.page <= 0
        ? DEFAULT_PAGE
        : params.page > totalPages
        ? totalPages
        : params.page;
    if (params.page !== correctedPage) {
      const newParams = new URLSearchParams();
      for (let key in params) {
        if (params[key as keyof typeof params])
          newParams.set(key, String(params[key as keyof typeof params]));
      }
      newParams.set("page", correctedPage.toString());
      redirect(`?${newParams.toString()}`);
    }
  } else {
    if (params.page != DEFAULT_PAGE) {
      const newParams = new URLSearchParams();
      for (let key in params) {
        if (params[key as keyof typeof params])
          newParams.set(key, String(params[key as keyof typeof params]));
      }
      newParams.set("page", DEFAULT_PAGE.toString());
      redirect(`?${newParams.toString()}`);
    }
  }
}
