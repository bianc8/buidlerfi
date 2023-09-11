'use client'
import { useEffect, useState, useContext } from "react"
import { Icons } from "@/components/ui/icons"
import { GraphContext } from '@/lib/context';
import { UserItem } from "@/components/user-item"

export function HoldingTab({ wallet }: {wallet: string}) {
  const [holding, setHolding] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const graphContext = useContext(GraphContext)

  useEffect(() => {
    //@ts-ignore
    if (!graphContext.graphData) return;

    //@ts-ignore
    const allHolders = graphContext.graphData.shareRelationships.filter((item: any) => {
      return item.holder.id == wallet?.toLowerCase();
    })

    setHolding(allHolders.map((item: any) => item.owner));
    setLoading(false);

    //@ts-ignore
  }, [graphContext.graphData, wallet])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full mt-24">
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  return (
    <>
      {holding.map((item: any) => 
        <UserItem item={item} key={`home-${item.owner}`} />
      )}
    </>
  )
}
