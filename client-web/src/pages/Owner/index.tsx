import * as React from 'react'
import {useStoreState} from '../../store'
import {useHistory} from 'react-router-dom'

export default function Owner() {
  const owner = useStoreState((state) => state.owner)
  const history = useHistory()
  React.useEffect(() => {
    if (!owner.firstName) {
      history.push('/')
    }
  }, [owner])

  return <div>
    Owner Page
  </div>
}