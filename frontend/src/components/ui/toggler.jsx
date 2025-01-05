import React from 'react'
import { Button } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'


export const DarkModeToggler = React.forwardRef(
  function DarkModeToggler() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
      <>
      <Button onClick={toggleColorMode}>
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
      </>
    )
  }
)
