import { Flex, Spinner } from "@chakra-ui/react"

type Props = {}

export default function Loading({ }: Props) {
  return (
    <Flex justify="center" align="center" height="100%">
      <Spinner size="xl" />
    </Flex>
  )
}