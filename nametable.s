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
.res ptr 2

.segment BSS

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
    STA 000, X
    STA 100, X
    STA 200, X
    STA 300, X
    STA 400, X
    STA 500, X
    STA 600, X
    STA 700, X
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
    ; Load the nametable
    LDA #<NAM1 ; Get the low byte
    STA ptr
    LDA #>NAM1 ; Get the high byte
    STA ptr+1
    STX 2006
    LDA #00
    STA 2006
    JSR LOADNAM
    LDA #80
    STA 2000
    LDA #18
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

NAM1:
    .incbin nametable.nam

LOADNAM:
    LDX #00
LOADNAM_XLOOP:
    LDY #00
LOADNAM_YLOOP:
    LDA (ptr), Y
    STA 2007
    INY
    BNE LOADNAM_YLOOP
    INC ptr+1
    INX
    CPX #04
    BNE LOADNAM_XLOOP
    RTS

NMI:
    ; Save the registers
    PHA
    TXA
    PHA
    TYA
    PHA
    ; Read PPUSTATUS
    BIT 2002
    ; Copy the sprites
    LDA #02
    STA 4014
    ; Load the palette
    LDX #00
    STX 2000
    STX 2001
    LDA #3F
    STA 2006
    STX 2006
NMI_LOADPALETTE:
    LDA PALETTE, X
    STA 2007
    INX
    CPX #20
    BNE NMI_LOADPALETTE
    LDA #80
    STA 2000
    LDA #18
    STA 2001
    LDA #$00
    STA 2005
    STA 2005
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
