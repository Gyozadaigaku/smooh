import { BellIcon } from '@chakra-ui/icons'
import { Tag, TagLabel, TagLeftIcon, HStack } from '@chakra-ui/react'
import React from 'react'

const TagList = (props: any) => {
  return (
    <HStack spacing={4}>
      <Tag borderRadius="full" size="sm" key="1" variant="solid" colorScheme="gray">
        <TagLeftIcon boxSize="12px" as={BellIcon} />
        <TagLabel>tag1</TagLabel>
      </Tag>
      <Tag borderRadius="full" size="sm" key="2" variant="solid" colorScheme="gray">
        <TagLeftIcon boxSize="12px" as={BellIcon} />
        <TagLabel>tag2</TagLabel>
      </Tag>
      <Tag borderRadius="full" size="sm" key="3" variant="solid" colorScheme="gray">
        <TagLeftIcon boxSize="12px" as={BellIcon} />
        <TagLabel>tag3</TagLabel>
      </Tag>
    </HStack>
  )
}

export default TagList
