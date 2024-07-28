import { getVideoData } from "@/utils/functions"
import React, { useEffect } from "react"

import { useExtension } from "../contexts/extensionContext"
import Actions from "./Actions"
import Panels from "./Panels/Panels"
import { Collapsible, CollapsibleContent } from "./ui/collapsible"

export default function Extension() {
  const {
    setExtensionContainer,
    setExtensionData,
    setExtensionIsOpen,
    setExtensionLoading,
    setExtensionPanel,
    setExtensionTheme,
    setExtensionVideoId,
    extensionTheme,
    extensionIsOpen,
    extensionVideoId
  } = useExtension()

  useEffect(() => {
    const getVideoId = () => {
      return new URLSearchParams(window.location.search).get("v")
    }

    const fetchVideoData = async () => {
      const id = getVideoId()

      if (id && id !== extensionVideoId) {
        setExtensionVideoId(id)
        setExtensionLoading(true)
        // setExtensionLoading(false)
        const data = await getVideoData(id)
        console.log(data)
      }
    }

    fetchVideoData()

    const intervalId = setInterval(fetchVideoData, 2000)

    return () => clearInterval(intervalId)
  }, [extensionVideoId])

  useEffect(() => {
    console.log("Fetches Theme ")
    const getCssVariable = (name: string) => {
      const rootStyle = getComputedStyle(document.documentElement)
      return rootStyle.getPropertyValue(name).trim()
    }
    const backgroundColor = getCssVariable("--yt-spec-base-background")

    if (backgroundColor === "#fff") {
      setExtensionTheme("light")
    } else {
      setExtensionTheme("dark")
    }
  }, [])

  if (!extensionTheme) return null
  return (
    <main
      ref={setExtensionContainer}
      className={`antialiased w-full mb-3 z-10 ${extensionTheme}`}>
      <div className="w-full">
        <Collapsible
          open={extensionIsOpen}
          onOpenChange={setExtensionIsOpen}
          className="space-y-3">
          <Actions />
          <CollapsibleContent className="w-full h-fit max-h-[500px] border border-zinc-200 rounded-md overflow-auto ">
            <Panels />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </main>
  )
}
