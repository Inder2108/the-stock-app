
import React from 'react';
import { Box, Flex, Text, VStack, HStack } from '@chakra-ui/react';

const EMAIndicator = ({ ema10 = 30, ema20 = 20, ema40 = 10, currentPrice = 25 }) => {
    // Calculate the range and positions
    const values = [ema10, ema20, ema40, currentPrice];
    const minValue = Math.min(...values) * 0.98; // Add some padding
    const maxValue = Math.max(...values) * 1.02; // Add some padding
    const range = maxValue - minValue;

    // Calculate positions as percentages (0-100)
    const getPosition = (value) => ((value - minValue) / range) * 100;

    const ema10Position = getPosition(ema10);
    const ema20Position = getPosition(ema20);
    const ema40Position = getPosition(ema40);
    const currentPricePosition = getPosition(currentPrice);

    // EMA data for labels
    const emaData = [
        { value: ema10, position: ema10Position, label: '10w EMA', color: 'purple.500' },
        { value: ema20, position: ema20Position, label: '20w EMA', color: 'purple.400' },
        { value: ema40, position: ema40Position, label: '40w EMA', color: 'purple.300' }
    ];

    return (
        <VStack borderRadius="lg" shadow="md" minW="400px">
            {/* <Text fontSize="lg" fontWeight="bold" color="gray.700">
        EMA Price Indicator
      </Text> */}

            <Box position="relative" w="100%" h="80px">
                {/* Main horizontal line */}
                <Box
                    position="absolute"
                    top="50%"
                    left="0"
                    right="0"
                    h="3px"
                    bg="gray.300"
                    borderRadius="full"
                    transform="translateY(-50%)"
                />

                {/* EMA dots */}
                {emaData.map((ema, index) => (
                    <Box key={index}>
                        {/* EMA dot */}
                        <Box
                            position="absolute"
                            top="50%"
                            left={`${ema.position}%`}
                            w="12px"
                            h="12px"
                            bg={ema.color}
                            borderRadius="full"
                            transform="translate(-50%, -50%)"
                            border="2px solid white"
                            shadow="sm"
                            zIndex={2}
                        />

                        {/* EMA label above */}
                        <VStack
                            position="absolute"
                            top="10px"
                            left={`${ema.position}%`}
                            transform="translateX(-50%)"
                            spacing={0}
                            zIndex={3}
                        >
                            <Text fontSize="xs" fontWeight="medium" color={ema.color}>
                                {ema.label}
                            </Text>
                            <Text fontSize="xs" color="gray.300">
                                ${ema.value.toFixed(2)}
                            </Text>
                        </VStack>
                    </Box>
                ))}

                {/* Current price dot */}
                <Box
                    position="absolute"
                    top="50%"
                    left={`${currentPricePosition}%`}
                    w="16px"
                    h="16px"
                    bg="red.500"
                    borderRadius="full"
                    transform="translate(-50%, -50%)"
                    border="3px solid white"
                    shadow="md"
                    zIndex={4}
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        w: '6px',
                        h: '6px',
                        bg: 'white',
                        borderRadius: 'full',
                        transform: 'translate(-50%, -50%)'
                    }}
                />

                {/* Current price label below */}
                <VStack
                    position="absolute"
                    bottom="10px"
                    left={`${currentPricePosition}%`}
                    transform="translateX(-50%)"
                    spacing={0}
                    zIndex={3}
                >
                </VStack>
            </Box>
        </VStack>
    );
};

export default EMAIndicator;
