"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@upstash/vector";
import { Product } from "@/db";

const SORT_OPTION = [
  { name: "None", value: "None" },
  { name: "Price:Low to High", value: "price-asc" },
  { name: "Price:High to Low", value: "price-desc" }
] as const;



export default function Home() {
  const [filter, setFilter] = useState({
  sort:"None",
  });

  const { data:products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<Product>[]>(
        'http://localhost:3000/api/products', {
          filter: {
            sort:filter.sort,
          }
        }
      )
      return data
    },
  })
  
  console.log(products);
  return (
    <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className=" text-4xl font-bold tracking-tight text-gray-900">
          High-Qulity-Cotton-Selection
        </h1>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className=" group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              sort
              <ChevronDown className=" -mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {SORT_OPTION.map((option) => (
                  <button key={option.name}
                    className={cn("text-left w-full block text-sm px-4 py-2", {
                      'text-gray-900 bg-gray-300': option.value === filter.sort,
                      'bg-gray-100':option.value!== filter.sort,
                    }) }
                    onClick={() => {
                    setFilter((prev) => ({
                      ...prev,
                      sort:option.value,
                    }))
                  }}>{ option.name }</button>
                ))}
              </DropdownMenuContent>
            
          </DropdownMenu>
          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="h-5 w-5"/>
          </button>
        </div>
      </div>
    </div>
  );
}
