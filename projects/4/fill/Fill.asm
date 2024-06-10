// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, 
// the screen should be cleared.

//// Replace this comment with your code.
  @SCREEN
  D=A
  @addr
  M=D
  @8192
  D=A
  @memory
  M=D
  @iOne
  M=1
  @iTwo
  M=1
(LOOPON)
  // if (KBD === 0) goto LOOPOFF, 키보드키 입력 오프될시 이동
  @KBD
  D=M
  @LOOPOFF
  D;JEQ
  // if (iOne > memory) goto LOOPON, 반복 루프
  @iOne
  D=M
  @memory
  D=D-M
  @LOOPON
  D;JGT
  // 초기화 iOne, addr 처리후, 픽셀 전체 색칠하기 루프
  @iOne
  M=1
  @iTwo
  M=1
  @SCREEN
  D=A
  @addr
  M=D
  @LOOPMAKEBLACK
  0;JMP
(LOOPOFF)
  // if (KBD !== 0) goto LOOPON, 키보드키 입력 온될시 이동
  @KBD
  D=M
  @LOOPON
  D;JNE
  // if (iTwo > memory) goto LOOPOFF, 반복 루프
  @iTwo
  D=M
  @memory
  D=D-M
  @LOOPOFF
  D;JGT
  // 초기화 iTwo, addr 처리후, 픽셀 전체 색 초기화 루프
  @iOne
  M=1
  @iTwo
  M=1
  @SCREEN
  D=A
  @addr
  M=D
  @LOOPMAKEWHITE
  0;JMP
(LOOPMAKEBLACK)
  // if (iOne > memory) goto LOOPON
  @iOne
  D=M
  @memory
  D=D-M
  @LOOPON
  D;JGT
  //RAM[addr] = -1
  @addr
  A=M
  M=-1
  @addr
  M=M+1
  @iOne
  M=M+1
  @LOOPMAKEBLACK
  0;JMP
(LOOPMAKEWHITE)
  // if (iTwo > memory) goto LOOPOFF
  @iTwo
  D=M
  @memory
  D=D-M
  @LOOPOFF
  D;JGT
  //RAM[addr] = 0
  @addr
  A=M
  M=0
  @addr
  M=M+1
  @iTwo
  M=M+1
  @LOOPMAKEWHITE
  0;JMP