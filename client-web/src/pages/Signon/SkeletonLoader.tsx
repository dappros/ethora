import React, { ReactNode, useEffect, useState } from "react"
import { Skeleton } from "@mui/material"

interface SkeletonLoaderProps {
  loading: boolean
  children: ReactNode
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  loading,
  children,
}) => {
  const [skeletons, setSkeletons] = useState<ReactNode[]>([])

  useEffect(() => {
    if (loading) {
      const components = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const { width, height, ...restProps } = child.props
          return (
            <Skeleton
              variant="rectangular"
              width={width || "100%"}
              height={height || 40}
              {...restProps}
            />
          )
        }
        return null
      })
      console.log(components)
      setSkeletons(components)
    }
  }, [loading, children])

  return <>{loading ? skeletons : children}</>
}

export default SkeletonLoader
