import { db } from "@/db"
import { ProductFilterValidater } from "@/lib/validater/product-validator"
import { NextRequest } from "next/server"

class Filter{
    private filters: Map<string, string[]> = new Map()
    
    hasFilter(){
    return this.filters.size>0
    }

    add(key: string, operator: string, value: string | number) {
        const filter = this.filters.get(key) || []
        filter.push(`${key} ${operator} ${typeof value === 'number' ? value : `"${value}"`}`)
        this.filters.set(key,filter)
      
    }

    addRaw(key: string, rawFilter: string) {
        this.filters.set(key,[rawFilter])
    }
    get() {
        const parts: string[] = []
        this.filters.forEach((filter) => {
            const groupValues = filter.join(` OR `)
            parts.push(`(${groupValues})`)
        })
        return parts.join(` AND `)
    }
}
const AVG_PRODUCT_PRICE = 25
const MAX_PRODUCT_PRICE = 50
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()

    const { color, price, size, sort } = ProductFilterValidater.parse(body.filter)
    const filter = new Filter()

    color.forEach((color) => filter.add("color", "=", color))
    size.forEach((size) => filter.add("size", "=", size))
    filter.addRaw("price",`price >= ${price[0]} AND price <= ${price[1]}`)
    

    const products = await db.query({
        topK: 12,
        vector: [0, 0, sort === "none" ? AVG_PRODUCT_PRICE : sort === "price-asc" ? 0 : MAX_PRODUCT_PRICE],
        includeMetadata: true,
        filter:filter.hasFilter()? filter.get():undefined
    })
    return new Response(JSON.stringify(products))
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: "internal server error" }), {
            status:500,
        })
    }
}