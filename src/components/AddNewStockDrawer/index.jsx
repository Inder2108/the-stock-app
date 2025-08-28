import { Button, Drawer, Field, Flex, Input, VStack } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AppContext } from "../../AppContext";

const AddNewStockDrawer = () => {
    const { isOpen, form, setForm, setIsOpen } = useContext(AppContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setForm({ ticker: '', qty: '', avgPrice: '' });
        setIsOpen(false)
    };
    return <Drawer.Root
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        placement="right"
    >
        <Drawer.Backdrop bg="blackAlpha.600" />
        <Drawer.Content bg="gray.800" color="white">
            <Drawer.Header>
                <Drawer.Title color="white" fontSize="xl">
                    Add New Stock
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <VStack spacing={4} align="stretch">
                    <Field.Root>
                        <Field.Label color="gray.200">Ticker Symbol</Field.Label>
                        <Input
                            name="ticker"
                            value={form.ticker}
                            onChange={handleChange}
                            placeholder="e.g., RELIANCE"
                            bg="gray.700"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            _placeholder={{ color: "gray.400" }}
                            _focus={{
                                borderColor: "blue.500",
                                boxShadow: "0 0 0 1px blue.500"
                            }}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color="gray.200">Quantity</Field.Label>
                        <Input
                            name="qty"
                            type="number"
                            value={form.qty}
                            onChange={handleChange}
                            placeholder="Number of shares"
                            bg="gray.700"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            _placeholder={{ color: "gray.400" }}
                            _focus={{
                                borderColor: "blue.500",
                                boxShadow: "0 0 0 1px blue.500"
                            }}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color="gray.200">Average Price</Field.Label>
                        <Input
                            name="avgPrice"
                            type="number"
                            step="0.01"
                            value={form.avgPrice}
                            onChange={handleChange}
                            placeholder="Average purchase price"
                            bg="gray.700"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            _placeholder={{ color: "gray.400" }}
                            _focus={{
                                borderColor: "blue.500",
                                boxShadow: "0 0 0 1px blue.500"
                            }}
                        />
                    </Field.Root>
                </VStack>
            </Drawer.Body>
            <Drawer.Footer>
                <Flex gap={3} width="100%">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        flex={1}
                        borderColor="gray.600"
                        color="gray.200"
                        _hover={{
                            bg: "gray.700",
                            borderColor: "gray.500"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSave}
                        loading={loading}
                        flex={1}
                        bg="blue.600"
                        _hover={{ bg: "blue.500" }}
                        color="white"
                    >
                        Save Stock
                    </Button>
                </Flex>
            </Drawer.Footer>
        </Drawer.Content>
    </Drawer.Root >
};

export default AddNewStockDrawer;

