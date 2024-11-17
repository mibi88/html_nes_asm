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

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob){
        // For Internet Explorer
        window.navigator.msSaveOrOpenBlob(file, filename);
    }else{
        var a = document.createElement("a")
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function lexer(code) {
    var i;
    var instructions = [];
    var lines = [];
    var currentInstruction = [];
    var inComment = false;
    var inIndirectAddressing = false;
    var token = "";
    var numChars = "0123456789abcdefABCDEF";
    // Create the tokens
    line = 1;
    for(i=0;i<code.length;i++){
        /*console.log(code[i]);
        console.log(inComment);
        console.log(token);*/
        //console.log(code[i]);
        if(code[i] == ';'){
            inComment = true;
            continue;
        }
        if(!inComment){
            switch(code[i]){
                case ' ':
                case '\t':
                    if(inIndirectAddressing){
                        //console.log("skip");
                        break;
                    }
                case '\n':
                case '\r':
                    inIndirectAddressing = false;
                    //console.log(token);
                    if(token.length){
                        currentInstruction.push(token);
                        token = "";
                    }
                    break;
                case '(':
                    inIndirectAddressing = true;
                    token += code[i];
                    break;
                case ')':
                    inIndirectAddressing = false;
                    token += code[i];
                    break;
                case ',':
                    if(!inIndirectAddressing) break;
                default:
                    token += code[i];
            }
        }
        if(code[i] == '\n' || code[i] == '\r'){
            if(currentInstruction.length){
                //console.log(currentInstruction);
                instructions.push(currentInstruction);
                lines.push(line);
                currentInstruction = []
            }
            inComment = false;
            line++;
        }
    }
    if(token.length){
        currentInstruction += token;
    }
    console.log(instructions);
    // Find their type
    var code = [];
    var n;
    for(i=0;i<instructions.length;i++){
        var offset = 0;
        //console.log(instructions[i]);
        line = lines[i];
        if(names.includes(instructions[i][0].toUpperCase())){
            addressingMode = -1;
            if(instructions[i].length == 1){
                addressingMode = AddressingMode.IMPLIED;
            }else if(instructions[i][1][0] == '#'){
                addressingMode = AddressingMode.IMMEDIATE;
            }else if(instructions[i].length >= 2){
                var valid = true;
                for(n=0;n<instructions[i][1].length;n++){
                    if(!numChars.includes(instructions[i][1][n])){
                        valid = false;
                    }
                }
                if(!instructions[i][1].includes('(')){
                    var num = instructions[i][1].split('+')[0];
                    //console.log(instructions[i][1]);
                    //console.log(instructions[i][1].split('+')[1]);
                    if(instructions[i][1].includes('+')){
                        offset = parseInt(instructions[i][1].split('+')[1]);
                        //console.log(offset);
                        if(!offset) offset = 0;
                    }
                    console.log(num);
                    var value;
                    if(valid){
                        value = parseInt(num, 16);
                    }else{
                        value = 0;
                    }
                    if(value < 256){
                        if(instructions[i].length == 3){
                            if(instructions[i][2].toUpperCase() == 'X' ||
                               instructions[i][2].toUpperCase() == 'Y'){
                                addressingMode = AddressingMode
                                    .INDEXED_ZERO_PAGE;
                            }
                        }
                        if(instructions[i].length == 2){
                            addressingMode = AddressingMode.ZERO_PAGE;
                        }
                    }else if(value < 65536){
                        if(instructions[i].length == 3){
                            if(instructions[i][2].toUpperCase() == 'X' ||
                               instructions[i][2].toUpperCase() == 'Y'){
                                addressingMode = AddressingMode
                                    .INDEXED_ABSOLUTE;
                            }
                        }
                        if(instructions[i].length == 2){
                            addressingMode = AddressingMode.ABSOLUTE;
                        }
                    }
                }else if(instructions[i][1][0] == '(' &&
                    instructions[i][1][instructions[i][1].length-1] == ')'){
                    if(instructions[i].length == 3){
                        if(instructions[i][2].toUpperCase('Y')){
                            addressingMode = AddressingMode.INDIRECT_INDEXED;
                        }
                    }else if(instructions[i].length == 2 &&
                        instructions[i][1].slice(-3).toUpperCase() == ",X)"){
                        addressingMode = AddressingMode.INDEXED_INDIRECT;
                    }else if(instructions[i].length == 2){
                        addressingMode = AddressingMode.ABSOLUTE_INDIRECT;
                    }
                }
            }
            if(addressingMode < 0){
                return 1;
            }
            var found = false;
            for(n=0;n<255;n++){
                if(instructions[i][0] == names[n]){
                    if(addressingMode == AddressingMode.IMPLIED){
                        if(addressingModes[n] == AddressingMode.ACCUMULATOR){
                            addressingMode = AddressingMode.ACCUMULATOR;
                            found = true;
                            break;
                        }
                    }
                    if(addressingMode == AddressingMode.ZERO_PAGE){
                        if(addressingModes[n] == AddressingMode.RELATIVE){
                            addressingMode = AddressingMode.RELATIVE;
                            found = true;
                            break;
                        }
                    }
                    if(addressingMode == AddressingMode.ZERO_PAGE){
                        if(addressingModes[n] == AddressingMode.ABSOLUTE){
                            found = true;
                            break;
                        }
                    }
                    if(addressingModes[n] == addressingMode){
                        found = true;
                        break;
                    }
                }
            }
            if(!found) return 2;
            //console.log(addressingModeNames[addressingMode]);
            code.push({type: "instruction", line: line,
                opcode: instructions[i][0], addressingMode: addressingMode,
                v1: instructions[i][1], v2: instructions[i][2],
                offset: offset});
        }else if(instructions[i][0][instructions[i][0].length-1] == ':'){
            //console.log("label");
            code.push({type: "label", line: line,
                name: instructions[i][0].slice(0, -1)});
        }else if(instructions[i][0][0] == '.'){
            code.push({type: "directive", line: line,
                name: instructions[i][0].slice(1).toLowerCase(),
                args: instructions[i].slice(1)});
        }else{
            return 0;
        }
    }
    return code;
}

function prepareBuild(code) {
    var i;
    var segment = "";
    var v;
    for(i=0;i<code.length;i++){
        v = code[i];
        if(v.type == "directive"){
            if(v.name == "segment" && v.args.length == 1){
                segment = v.args[0];
            }else if(v.name == "res" && v.args.length == 2){
                var size = parseInt(v.args[1], 16);
                if(size > 0){
                    //console.log(segment);
                    if(segment == "ZEROPAGE"){
                        zpvars.push({name: v.args[0], addr: zpcur});
                        zpcur += size;
                    }else if(segment == "BSS"){
                        bssvars.push({name: v.args[0], addr: bsscur});
                        bsscur += size;
                    }else{
                        output.textContent += v.line.toString() +
                            ": Invalid segment for .res, skipping!\n";
                    }
                }else{
                    output.textContent += v.line.toString() +
                        ": Invalid size for .res, skipping!\n";
                }
            }
        }else if(v.type == "label"){
            labelnames.push(v.name);
        }
    }
}

function updateAddressingModes(code) {
    var i;
    var v;
    var n;
    for(i=0;i<code.length;i++){
        v = code[i];
        if(v.type == "instruction"){
            /*console.log(v.v1);
            console.log(parseInt(v.v1));*/
            var found = false;
            if(parseInt(v.v1) != NaN && v.v1){
                console.log("Fix addressing mode...");
                console.log(v.v1.split('+')[0]);
                console.log(v.opcode);
                for(n=0;n<zpvars.length;n++){
                    console.log(zpvars[n].name);
                    if(v.v1.split('+')[0] == zpvars[n].name){
                        console.log("ZP VAR!");
                        code[i].v1 = zpvars[n].addr.toString(16);
                        found = true;
                        break;
                    }
                }
                for(n=0;n<bssvars.length;n++){
                    console.log(bssvars[n].name);
                    if(v.v1.split('+')[0] == bssvars[n].name){
                        console.log("BSS VAR!");
                        code[i].v1 = bssvars[n].addr.toString(16);
                        switch(code[i].addressingMode){
                            case AddressingMode.ZERO_PAGE:
                                code[i].addressingMode =
                                    AddressingMode.ABSOLUTE;
                                break;
                            case AddressingMode.INDEXED_ZERO_PAGE:
                                code[i].addressingMode =
                                    AddressingMode.INDEXED_ABSOLUTE;
                                break;
                        }
                        found = true;
                        break;
                    }
                }
                if(!found){
                    if(labelnames.includes(v.v1)){
                        switch(code[i].addressingMode){
                            case AddressingMode.ZERO_PAGE:
                                code[i].addressingMode =
                                    AddressingMode.ABSOLUTE;
                                break;
                            case AddressingMode.INDEXED_ZERO_PAGE:
                                code[i].addressingMode =
                                    AddressingMode.INDEXED_ABSOLUTE;
                                break;
                        }
                        found = true;
                    }
                }
            }
            if(v.v1){
                if(v.v1[0] == '('){
                    if(v.addressingMode == AddressingMode.INDEXED_INDIRECT){
                        var name = v.v1.slice(1).split(',')[0];
                        console.log(name);
                        for(n=0;n<zpvars.length;n++){
                            console.log(zpvars[n].name);
                            if(name == zpvars[n].name){
                                console.log("ZP VAR!");
                                code[i].v1 = zpvars[n].addr.toString(16);
                                found = true;
                                break;
                            }
                        }
                    }else if(v.addressingMode ==
                        AddressingMode.INDIRECT_INDEXED){
                        var name = v.v1.slice(1, -1);
                        console.log(name);
                        for(n=0;n<zpvars.length;n++){
                            console.log(zpvars[n].name);
                            if(name == zpvars[n].name){
                                console.log("ZP VAR!");
                                code[i].v1 = zpvars[n].addr.toString(16);
                                found = true;
                                break;
                            }
                        }
                    }else if(v.addressingMode ==
                        AddressingMode.ABSOLUTE_INDIRECT){
                        var name = v.v1.slice(1, -1);
                        console.log("absolute indirect");
                        console.log(name);
                        for(n=0;n<zpvars.length;n++){
                            console.log(zpvars[n].name);
                            if(name == zpvars[n].name){
                                console.log("ZP VAR!");
                                code[i].v1 = zpvars[n].addr.toString(16);
                                found = true;
                                break;
                            }
                        }
                        for(n=0;n<bssvars.length;n++){
                            console.log(bssvars[n].name);
                            if(name == bssvars[n].name){
                                console.log("BSS VAR!");
                                code[i].v1 = bssvars[n].addr.toString(16);
                                found = true;
                                break;
                            }
                        }
                    }else{
                        output.textContent += v.line.toString() +
                            ": Invalid addressing mode, skipping!\n";
                    }
                }
            }
            console.log(v.opcode);
            if((v.opcode == "JMP" || v.opcode == "JSR") &&
                v.addressingMode == AddressingMode.ZERO_PAGE){
                code[i].addressingMode = AddressingMode.ABSOLUTE;
            }
        }
    }
    return code;
}

async function getLabelAddresses(code) {
    var segment = "";
    var pos = 0x8000;
    var labels = [];
    var i;
    includedFiles = [];
    for(i=0;i<code.length;i++){
        v = code[i];
        console.log("item");
        console.log(v.line);
        console.log(pos.toString(16));
        if(v.type == "directive"){
            console.log("directive");
            if(v.name == "segment" && v.args.length == 1){
                console.log("found segment");
                console.log(v.args[0]);
                segment = v.args[0];
            }
            if(v.name == "byte" && v.args.length == 1 && segment == "STARTUP"){
                pos++;
            }else if(v.name == "incbin" && v.args.length == 1){
                if(segment == "STARTUP"){
                    alert("Please select \"" + v.args[0].toString() + "\"");
                    console.log("Please select \"" +
                        v.args[0].toString() + "\"");
                    var input = document.createElement('input');
                    input.type = 'file';
                    input.click();
                    await eventPromise(input, "change");
                    console.log("file selected!");
                    var fileData;
                    await new Promise(function(resolve, reject) {
                        if(!input.files.length){
                            output.textContent += v.line.toString() +
                                ": Not enough files selected, skipping!\n";
                            reject();
                        }
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            fileData = Array.from(
                                    new Uint8Array(e.target.result));
                            resolve();
                        }
                        fileReader.onerror = function() {
                            output.textContent += v.line.toString() +
                                ": Failed to load file, skipping!\n";
                            reject();
                        }
                        fileReader.readAsArrayBuffer(input.files[0]);
                    });
                    console.log("file recieved!");
                    console.log(fileData);
                    includedFiles.push({name: v.args[0].toString(),
                        data: fileData});
                    pos += fileData.length;
                }else{
                    output.textContent += v.line.toString() +
                        ": Invalid segment, skipping!\n";
                }
            }
        }else if(v.type == "instruction"){
            if(segment == "STARTUP"){
                pos += opSize[v.addressingMode];
                console.log("instruction found");
            }else{
                output.textContent += v.line.toString() +
                    ": Invalid segment, skipping!\n";
            }
        }else if(v.type == "label"){
            if(segment == "STARTUP"){
                labels.push({name: v.name, pos: pos});
            }else{
                output.textContent += v.line.toString() +
                    ": Invalid segment, skipping!\n";
            }
        }
    }
    return labels;
}

function getLabelPos(label) {
    var n;
    for(n=0;n<labels.length;n++){
        if(label == labels[n].name && labels[n].pos != NaN){
            return labels[n].pos;
        }
    }
    return undefined;
}

function parseValue(v) {
    var n;
    if(v[0] == '<'){
        console.log(getLabelPos(v.slice(1)));
        if(getLabelPos(v.slice(1)) != undefined){
            console.log(getLabelPos(v.slice(1))&0xFF);
            return getLabelPos(v.slice(1))&0xFF;
        }
    }
    if(v[0] == '>'){
        console.log(getLabelPos(v.slice(1)));
        if(getLabelPos(v.slice(1)) != undefined){
            console.log(getLabelPos(v.slice(1))>>8);
            return getLabelPos(v.slice(1))>>8;
        }
    }
    if(parseInt(v, 16) != NaN) return parseInt(v, 16);
    return undefined;
}

async function eventPromise(item, event) {
    return new Promise(function(resolve) {
        const listener = function() {
            item.removeEventListener(event, listener);
            resolve();
        }
        item.addEventListener(event, listener);
    });
}

function assemble(code) {
    var i;
    var segment = "";
    var v;
    var n;
    var codePos = 0x8000;
    for(i=0;i<code.length;i++){
        v = code[i];
        if(v.type == "directive"){
            if(v.name == "segment" && v.args.length == 1){
                console.log("found segment");
                console.log(v.args[0]);
                segment = v.args[0];
            }else if(v.name == "byte" && v.args.length == 1){
                var num = parseInt(v.args[0], 16);
                if(num != NaN){
                    switch(segment){
                        case "STARTUP":
                            startup.push(num);
                            codePos++;
                            break;
                        case "HEADER":
                            header.push(num);
                            break;
                        case "VECTORS":
                            vectors.push(num);
                            break;
                        default:
                            console.log("segment");
                            console.log(segment);
                            output.textContent += v.line.toString() +
                                ": Invalid segment, skipping!\n";
                    }
                }
            }else if(v.name == "incbin" && v.args.length == 1){
                var found = false;
                for(n=0;n<includedFiles.length;n++){
                    if(includedFiles[n].name == v.args[0]){
                        startup = startup.concat(includedFiles[n].data);
                        codePos += includedFiles[n].data.length;
                        found = true;
                        break;
                    }
                }
                if(!found){
                    output.textContent += v.line.toString() +
                        ": File not found, skipping!\n";
                }
            }
        }else if(v.type == "instruction"){
            if(segment == "STARTUP"){
                var opcode = -1;
                /*console.log("instruction");
                console.log(v.name);
                console.log(v.addressingMode);
                console.log(v.v1);
                console.log(v.v2);
                console.log("searching opcode");*/
                var is_indexed =
                    v.addressingMode == AddressingMode.INDEXED_ZERO_PAGE ||
                    v.addressingMode == AddressingMode.INDEXED_ABSOLUTE ||
                    v.addressingMode == AddressingMode.INDEXED_INDIRECT ||
                    v.addressingMode == AddressingMode.INDIRECT_INDEXED;
                if(v.addressingMode == AddressingMode.INDEXED_INDIRECT){
                    v.v2 = "X";
                }else if(v.addressingMode == AddressingMode.INDIRECT_INDEXED){
                    v.v2 = "Y";
                }
                if(is_indexed && !v.v2){
                    output.textContent += v.line.toString() +
                        ": Missing register!\n";
                }
                for(n=0;n<names.length;n++){
                    /*console.log(names[n]);
                    console.log(addressingModes[n]);
                    console.log(registers[n]);*/
                    if(names[n] == v.opcode &&
                        addressingModes[n] == v.addressingMode &&
                        (is_indexed ? registers[n] == v.v2 : 1)){
                        opcode = n;
                        break;
                    }
                }
                if(opcode >= 0){
                    startup.push(opcode);
                    switch(opSize[v.addressingMode]){
                        case 2:
                            if(v.addressingMode == AddressingMode.RELATIVE){
                                console.log("relative addressing!");
                                if(parseInt(v.v1, 16) == NaN){
                                    output.textContent +=
                                        v.line.toString() +
                                        ": Invalid value, skipping!\n";
                                }else{
                                    var l = parseInt(v.v1, 16);
                                    var d = l-codePos-opSize[v.addressingMode];
                                    console.log(d);
                                    if(d < -128 || d > 127){
                                        output.textContent +=
                                            v.line.toString() +
                                            ": Branching too far!\n";
                                    }else{
                                        d = (256+d)%255;
                                        startup.push(d);
                                    }
                                }
                            }else{
                                var strvalue;
                                if(v.v1){
                                    if(v.addressingMode ==
                                        AddressingMode.IMMEDIATE){
                                        strvalue = v.v1.slice(1);
                                    }else{
                                        strvalue = v.v1;
                                    }
                                    console.log(parseInt(strvalue, 16));
                                    if(isNaN(parseInt(strvalue, 16))){
                                        output.textContent +=
                                            v.line.toString() +
                                            ": Invalid value, skipping!\n";
                                        startup.push(0);
                                    }else{
                                        if(parseInt(strvalue, 16)+v.offset >
                                            0xFF){
                                            console.log("too big");
                                            output.textContent +=
                                                v.line.toString() +
                                                ": Too big value, taking " +
                                                "low byte!\n";
                                        }
                                        startup.push(
                                            (parseInt(strvalue, 16)+v.offset)&
                                            0xFF);
                                    }
                                }else{
                                    output.textContent += v.line.toString() +
                                        ": Invalid value, skipping!\n";
                                }
                            }
                            break;
                        case 3:
                            if(isNaN(parseInt(v.v1, 16))){
                                output.textContent += v.line.toString() +
                                    ": Invalid value, skipping!\n";
                            }
                            startup.push((parseInt(v.v1, 16)+v.offset)&
                                0xFF);
                            startup.push((parseInt(v.v1, 16)+v.offset)>>8);
                            console.log("address");
                            console.log(parseInt(v.v1, 16));
                            console.log(v.offset);
                            console.log((parseInt(v.v1, 16)+v.offset)&
                                0xFF);
                            console.log((parseInt(v.v1, 16)+v.offset)>>8);
                            break;
                    }
                    codePos += opSize[v.addressingMode];
                }else{
                    output.textContent += v.line.toString() +
                        ": Unknown opcode, skipping!\n";
                }
            }else{
                output.textContent += v.line.toString() +
                    ": Invalid segment, skipping!\n";
            }
        }
    }
    return;
}

function updateValues(code) {
    var i;
    var n;
    for(i=0;i<code.length;i++){
        if(code[i].type == "instruction"){
            if(code[i].addressingMode == AddressingMode.IMMEDIATE){
                if(code[i].v1){
                    if(parseValue(code[i].v1.slice(1)) != undefined){
                        code[i].v1 = "#" + parseValue(code[i].v1.slice(1)).
                            toString(16);
                    }
                }
            }else{
                if(labelnames.includes(code[i].v1)){
                    for(n=0;n<labels.length;n++){
                        if(labels[n].name == code[i].v1){
                            code[i].v1 = labels[n].pos.toString(16);
                        }
                    }
                }
            }
        }else if(code[i].type == "directive" && code[i].name == "byte" &&
            code[i].args.length == 1){
            if(code[i].args[0]){
                if(parseValue(code[i].args[0]) != undefined){
                    code[i].args[0] = parseValue(code[i].args[0]).toString(16);
                }
            }
        }
    }
    return code;
}

function generateRom() {
    var asm = document.getElementById("asm");
    var chr = document.getElementById("chr");
    var outputFile = document.getElementById("output_file");
    data = [];
    header = [];
    startup = [];
    vectors = [];
    labelnames = [];
    zpcur = 0;
    bsscur = 0x300;
    zpvars = [];
    bssvars = [];
    output = document.getElementById("output");
    line = 1;
    if(asm.files.length && chr.files.length){
        // Read the files
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var asmData = e.target.result;
            var reader = new FileReader();
            
            reader.onload = async function(e) {
                var chrData = Array.from(new Uint8Array(e.target.result));
                console.log(chrData);
                console.log(e.target.result);
                // Assemble the code
                console.log(asmData);
                console.log(chrData);
                var instructions = lexer(asmData);
                if(typeof(instructions) == "number"){
                    console.log(output);
                    switch(instructions){
                        case 0:
                            output.textContent += line.toString() +
                                ": Invalid instruction!\n";
                            break;
                        case 1:
                            output.textContent += line.toString() +
                                ": Unknown addressing mode!\n";
                            break;
                        case 2:
                            output.textContent += line.toString() +
                                ": Invalid addressing mode!\n";
                            break;
                        default:
                            output.textContent += line.toString() +
                                ": Unknown error!\n";
                    }
                    return;
                }
                console.log(instructions);
                console.log(instructions.length);
                prepareBuild(instructions);
                console.log(zpvars);
                console.log(bssvars);
                instructions = updateAddressingModes(instructions);
                console.log(instructions);
                console.log(instructions.length);
                labels = await getLabelAddresses(instructions);
                console.log(labels);
                instructions = updateValues(instructions);
                console.log(instructions);
                console.log(instructions.length);
                assemble(instructions);
                console.log(vectors);
                output.textContent += "Code assembled successfully!\n";
                console.log("Code assembled successfully!");
                // Generate the ROM
                if(header.length > 0x10){
                    output.textContent += "Header too big: size " +
                        header.length + "\n";
                    return;
                }
                while(header.length < 0x10){
                    header.push(0);
                }
                if(startup.length > 0x3FFA){
                    output.textContent += "Startup too big: size " +
                        startup.length + "\n";
                    return;
                }
                while(startup.length < 0x3FFA){
                    startup.push(0);
                }
                if(vectors.length > 0x6){
                    output.textContent += "Vectors too big: size " +
                        vectors.length + "\n";
                    return;
                }
                while(vectors.length < 0x6){
                    vectors.push(0);
                }
                if(chrData.length > 0x2000){
                    output.textContent += "CHR Data too big: size " +
                        chrData.length + "\n";
                    return;
                }
                while(chrData.length < 0x2000){
                    chrData.push(0);
                }
                console.log(header);
                console.log(startup);
                console.log(vectors);
                console.log(chrData);
                data = header;
                data = data.concat(startup);
                data = data.concat(vectors);
                data = data.concat(chrData);
                console.log(data);
                output.textContent += "Code linked successfully!\n";
                console.log("Code linked successfully!");
                download(new Uint8Array(data), outputFile.value,
                    "application/x-nes-rom");
            };
            reader.readAsArrayBuffer(chr.files[0]);
        };
        
        reader.readAsText(asm.files[0]);
    }
}
