import { CircularProgress } from "@mui/material"
import { FC } from "react"

interface Props {
  styles: Object
}

const Loader: FC<Props> = ({ styles }) => {
  return (
    <div
      style={{
        minWidth: 650,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "700px",
        ...styles,
      }}
    >
      <CircularProgress />
    </div>
  )
}

export { Loader }
