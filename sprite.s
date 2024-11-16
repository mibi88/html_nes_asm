; --- PPU REGISTERS ---
; 2000 PPUCTRL
; 2001 PPUMASK
; 2002 PPUSTATUS
; 2003 OAMADDR
; 2004 OAMDATA
; 2005 PPUSCROLL
; 2006 PPUADDR
; 2007 PPUDATA
; 4014 OAMDMA

; Sprites: Y, tile, flags, X

.segment HEADER
.byte 4E
.byte 45
.byte 53
.byte 1A
.byte 01
.byte 01
.byte 00
.byte 00
.byte 00
.byte 01
.byte 21 ; 20 for bus conflicts and 1 for multiple TV systems

.segment ZEROPAGE
.res zp1 2
.res zp2 1

.segment BSS
.res bss1 64 ; 100 in hex
.res bss2 F

.segment STARTUP
RESET:
    SEI
    CLD
    LDA #40
    STA 4017
    LDX #FF
    TXS
    INX
    STX 2000
    STX 2001
    STX 4010
    ; Clear vblank flag
    BIT 2002
RESET_WAITVBLANK1:
    BIT 2002
    BPL RESET_WAITVBLANK1
    LDA #00
RESET_CLEARMEM:
    STA 000
    STA 100
    STA 200
    STA 300
    STA 400
    STA 500
    STA 600
    STA 700
    INX
    BNE RESET_CLEARMEM
RESET_WAITVBLANK2:
    BIT 2002
    BPL RESET_WAITVBLANK2
    TAX
    LDA #3F
    STA 2006
    STX 2006
RESET_LOADPALETTE:
    LDA PALETTE, X
    STA 2007
    INX
    CPX #20
    BNE RESET_LOADPALETTE
    LDA #80
    STA 2000
    LDA #10
    STA 2001
    ; Add a sprite
    LDA #10
    STA 200
    LDA #61
    STA 201
    LDA #08
    STA 203
RESET_GAMELOOP:
    JMP RESET_GAMELOOP

NMI:
    ; Save the registers
    PHA
    TXA
    PHA
    TYA
    PHA
    ; Read PPUSTATUS
    BIT 2002
    LDA #02
    STA 4014
    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    ; Return from the interrupt
    RTI

IRQ:
    RTI

PALETTE:
    ; Palette 1
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 2
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 3
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 4
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 1
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 2
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 3
    .byte 00
    .byte 30
    .byte 30
    .byte 30
    ; Palette 4
    .byte 00
    .byte 30
    .byte 30
    .byte 30

.segment VECTORS
.byte <NMI ; Get the low byte
.byte >NMI ; Get the high byte
.byte <RESET
.byte >RESET
.byte <IRQ
.byte >IRQ
