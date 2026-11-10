"use client";
import { useAppSelector } from "@/redux/hooks";
import { selectCatalog } from "@/redux/model/selectors";

import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/redux/hooks";
import { setSelectedModel, setSelectedModelGroup } from "@/redux/model/slice";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";

export const useSelectModel = () => {
  const catalog = useAppSelector(selectCatalog);
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (model: string) => {
    const found = getModelGroupAndItem(model, catalog);
    if (!found) return;
    dispatch(setSelectedModel(model));
    dispatch(setSelectedModelGroup(found.group));
    router.push("/");
  };
};
