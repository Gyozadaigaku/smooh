import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useColorMode, IconButton } from '@chakra-ui/react'

const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const iconColor = {
    light: 'black',
    dark: 'white',
  }
  return (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <IconButton
      aria-label="Toggle dark mode"
      // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      color={iconColor[colorMode]}
    />
  )
}

export default DarkModeSwitch
