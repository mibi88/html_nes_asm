/* A very simple assembler for the NES.
 * by Mibi88
 *
 * This software is licensed under the BSD-3-Clause license:
 *
 * Copyright 2024 Mibi88
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived from this
 * software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

class AddressingMode {
    static ACCUMULATOR = 0;
    static IMMEDIATE = 1;
    static ABSOLUTE = 2;
    static ZERO_PAGE = 3;
    static INDEXED_ZERO_PAGE = 4;
    static INDEXED_ABSOLUTE = 5;
    static IMPLIED = 6;
    static RELATIVE = 7;
    static INDEXED_INDIRECT = 8; // (Indirect, X)
    static INDIRECT_INDEXED = 9; // (Indirect), Y
    static ABSOLUTE_INDIRECT = 10;
}

addressingModeNames = [
    "ACCUMULATOR",
    "IMMEDIATE",
    "ABSOLUTE",
    "ZERO_PAGE",
    "INDEXED_ZERO_PAGE",
    "INDEXED_ABSOLUTE",
    "IMPLIED",
    "RELATIVE",
    "INDEXED_INDIRECT",
    "INDIRECT_INDEXED",
    "ABSOLUTE_INDIRECT",
];

names = [
    // 0x00 to 0x1F
    "BRK",
    "ORA",
    "STP",
    "SLO",
    "NOP",
    "ORA",
    "ASL",
    "SLO",
    "PHP",
    "ORA",
    "ASL",
    "ANC",
    "NOP",
    "ORA",
    "ASL",
    "SLO",
    "BPL",
    "ORA",
    "STP",
    "SLO",
    "NOP",
    "ORA",
    "ASL",
    "SLO",
    "CLC",
    "ORA",
    "NOP",
    "SLO",
    "NOP",
    "ORA",
    "ASL",
    "SLO",
    // 0x20 to 0x3F
    "JSR",
    "AND",
    "STP",
    "RLA",
    "BIT",
    "AND",
    "ROL",
    "RLA",
    "PLP",
    "AND",
    "ROL",
    "ANC",
    "BIT",
    "AND",
    "ROL",
    "RLA",
    "BMI",
    "AND",
    "STP",
    "RLA",
    "NOP",
    "AND",
    "ROL",
    "RLA",
    "SEC",
    "AND",
    "NOP",
    "RLA",
    "NOP",
    "AND",
    "ROL",
    "RLA",
    // 0x40 to 0x5F
    "RTI",
    "EOR",
    "STP",
    "SRE",
    "NOP",
    "EOR",
    "LSR",
    "SRE",
    "PHA",
    "EOR",
    "LSR",
    "ALR",
    "JMP",
    "EOR",
    "LSR",
    "SRE",
    "BVC",
    "EOR",
    "STP",
    "SRE",
    "NOP",
    "EOR",
    "LSR",
    "SRE",
    "CLI",
    "EOR",
    "NOP",
    "SRE",
    "NOP",
    "EOR",
    "LSR",
    "SRE",
    // 0x60 to 0x7F
    "RTS",
    "ADC",
    "STP",
    "RRA",
    "NOP",
    "ADC",
    "ROR",
    "RRA",
    "PLA",
    "ADC",
    "ROR",
    "ARR",
    "JMP",
    "ADC",
    "ROR",
    "RRA",
    "BVS",
    "ADC",
    "STP",
    "RRA",
    "NOP",
    "ADC",
    "ROR",
    "RRA",
    "SEI",
    "ADC",
    "NOP",
    "RRA",
    "NOP",
    "ADC",
    "ROR",
    "RRA",
    // 0x80 to 9F
    "NOP",
    "STA",
    "NOP",
    "SAX",
    "STY",
    "STA",
    "STX",
    "SAX",
    "DEY",
    "NOP",
    "TXA",
    "XAA",
    "STY",
    "STA",
    "STX",
    "SAX",
    "BCC",
    "STA",
    "STP",
    "AHX",
    "STY",
    "STA",
    "STX",
    "SAX",
    "TYA",
    "STA",
    "TXS",
    "TAS",
    "SHY",
    "STA",
    "SHX",
    "AHX",
    // 0xA0 to 0xBF
    "LDY",
    "LDA",
    "LDX",
    "LAX",
    "LDY",
    "LDA",
    "LDX",
    "LAX",
    "TAY",
    "LDA",
    "TAX",
    "LAX",
    "LDY",
    "LDA",
    "LDX",
    "LAX",
    "BCS",
    "LDA",
    "STP",
    "LAX",
    "LDY",
    "LDA",
    "LDX",
    "LAX",
    "CLV",
    "LDA",
    "TSX",
    "LAS",
    "LDY",
    "LDA",
    "LDX",
    "LAX",
    // C0 to DF
    "CPY",
    "CMP",
    "NOP",
    "DCP",
    "CPY",
    "CMP",
    "DEC",
    "DCP",
    "INY",
    "CMP",
    "DEX",
    "AXS",
    "CPY",
    "CMP",
    "DEC",
    "DCP",
    "BNE",
    "CMP",
    "STP",
    "DCP",
    "NOP",
    "CMP",
    "DEC",
    "DCP",
    "CLD",
    "CMP",
    "NOP",
    "DCP",
    "NOP",
    "CMP",
    "DEC",
    "DCP",
    // E0 to FF
    "CPX",
    "SBC",
    "NOP",
    "ISC",
    "CPX",
    "SBC",
    "INC",
    "ISC",
    "INX",
    "SBC",
    "NOP",
    "SBC",
    "CPX",
    "SBC",
    "INC",
    "ISC",
    "BEQ",
    "SBC",
    "STP",
    "ISC",
    "NOP",
    "SBC",
    "INC",
    "ISC",
    "SED",
    "SBC",
    "NOP",
    "ISC",
    "NOP",
    "SBC",
    "INC",
    "ISC"
];

cycles = [
    7, 6, 0, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6, // 0x00 to 0x0F
    2, 5, 0, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, // 0x10 to 0x1F
    6, 6, 0, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6, // 0x20 to 0x2F
    2, 5, 0, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, // 0X30 to 0x3F
    6, 6, 0, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6, // 0x40 to 0x4F
    2, 5, 0, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, // 0x50 to 0x5F
    6, 6, 0, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6, // 0x60 to 0x6F
    2, 5, 0, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, // 0x70 to 0x7F
    2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, // 0x80 to 0x8F
    2, 6, 0, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5, // 0x90 to 0x9F
    2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, // 0xA0 to 0xAF
    2, 5, 0, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4, // 0xB0 to 0xBF
    2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, // 0xC0 to 0xCF
    2, 5, 0, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, // 0xD0 to 0xDF
    2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, // 0xE0 to 0xEF
    2, 5, 0, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7  // 0xF0 to 0xFF
];

addCycleOnPageCrossing = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x00 to 0x0F
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, // 0x10 to 0x1F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x20 to 0x2F
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, // 0x30 to 0x3F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x40 to 0x4F
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, // 0x50 to 0x5F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x60 to 0x6F
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, // 0x70 to 0x7F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x80 to 0x8F
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x90 to 0x9F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xA0 to 0xAF
    1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, // 0xB0 to 0xBF
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xC0 to 0xCF
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, // 0xD0 to 0xDF
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xE0 to 0xEF
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, // 0xF0 to 0xFF
];

 addressingModes = [
    // 0x00 to 0x0F
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ACCUMULATOR,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0x10 to 0x1F
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0x20 to 0x2F
    AddressingMode.ABSOLUTE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ACCUMULATOR,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0x30 to 0x3F
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0x40 to 0x4F
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ACCUMULATOR,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0x50 to 0x5F
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0x60 to 0x6F
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ACCUMULATOR,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE_INDIRECT,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0x70 to 0x7F
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0x80 to 0x8F
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0x90 to 0x9F
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0xA0 to 0xAF
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0xB0 to 0xBF
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0xC0 to 0xCF
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0xD0 to 0xDF
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    // 0xE0 to 0xEF
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.IMMEDIATE,
    AddressingMode.INDEXED_INDIRECT,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.IMPLIED,
    AddressingMode.IMMEDIATE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    AddressingMode.ABSOLUTE,
    // 0xF0 to 0xFF
    AddressingMode.RELATIVE,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.IMPLIED,
    AddressingMode.INDIRECT_INDEXED,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.INDEXED_ZERO_PAGE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.IMPLIED,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
    AddressingMode.INDEXED_ABSOLUTE,
];

registers =
      " X X            "  // 0x00 to 0x0F
    + " Y YXXXX Y YXXXX"  // 0x10 to 0x1F
    + " X X            "  // 0x20 to 0x2F
    + " Y YXXXX Y YXXXX"  // 0x30 to 0x3F
    + " X X            "  // 0x40 to 0x4F
    + " Y YXXXX Y YXXXX"  // 0x50 to 0x5F
    + " X X            "  // 0x60 to 0x6F
    + " Y YXXXX Y YXXXX"  // 0x70 to 0x7F
    + " X X            "  // 0x80 to 0x8F
    + " Y YXXYY Y YXXYY"  // 0x90 to 0x9F
    + " X X            "  // 0xA0 to 0xAF
    + " Y YXXYY Y YXXYY"  // 0xB0 to 0xBF
    + " X X            "  // 0xC0 to 0xCF
    + " Y YXXXX Y YXXXX"  // 0xD0 to 0xDF
    + " X X            "  // 0xE0 to 0xEF
    + " Y YXXXX Y YXXXX"; // 0xF0 to 0xFF

opSize = [
    1,
    2,
    3,
    2,
    2,
    3,
    1,
    2,
    2,
    2,
    3
];