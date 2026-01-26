// Mozzi Huffman Compression Utility
// Implements Differential Huffman Compression compatible with Mozzi's SampleHuffman class.

var MozziHuffmanConverter = {

    convert: function(file, callback) {
        // Reuse SampleConverter's decoding and resampling
        if (typeof MozziSampleConverter === 'undefined') {
            if(callback) callback(null, "Sample Converter missing");
            return;
        }
        
        MozziSampleConverter.processFile(file, function(result) {
            if (!result) { if(callback) callback(null); return; }
            
            // 1. Perform Huffman compression on the int8 data
            var huffResult = MozziHuffmanConverter.processData(result.data);
            
            // 2. Generate C++
            var varName = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            var cpp = "// Huffman Table\n";
            cpp += "const int16_t " + varName + "_huffman [] PROGMEM = {" + huffResult.huffmanTable.join(',') + "};\n";
            cpp += "// Compressed Data\n";
            cpp += "const uint8_t " + varName + "_data [] PROGMEM = {" + huffResult.encodedData.join(',') + "};\n";
            cpp += "#define " + varName.toUpperCase() + "_NUM_BITS " + huffResult.bitCount + "\n";
            
            if(callback) callback({
                name: varName + '.h',
                data: huffResult.encodedData,
                cpp: cpp
            });
        });
    },

    processData: function(int8Data) {
        // 1. Calculate Differentials
        var diffs = [];
        var current = 0;
        for (var i = 0; i < int8Data.length; i++) {
            // Mozzi logic: diff = sample - previous
            // Values are int8, diffs can be larger? 
            // In C++ int16_t dif = decode(). Mozzi uses int16 for decoding diffs.
            var val = int8Data[i];
            var diff = val - current;
            diffs.push(diff);
            current = val;
        }

        // 2. Frequency Count
        var freqs = {};
        diffs.forEach(function(d) {
            freqs[d] = (freqs[d] || 0) + 1;
        });

        // 3. Build Huffman Tree (Priority Queue)
        var queue = [];
        Object.keys(freqs).forEach(function(val) {
            queue.push({ val: parseInt(val), freq: freqs[val], isLeaf: true });
        });

        // Sort ascending
        queue.sort(function(a, b) { return a.freq - b.freq; });

        while (queue.length > 1) {
            var node1 = queue.shift(); // Smallest
            var node2 = queue.shift(); // Second smallest
            
            var parent = {
                freq: node1.freq + node2.freq,
                left: node1,
                right: node2,
                isLeaf: false
            };
            
            // Insert back maintaining order
            var inserted = false;
            for(var k=0; k<queue.length; k++) {
                if(parent.freq < queue[k].freq) {
                    queue.splice(k, 0, parent);
                    inserted = true;
                    break;
                }
            }
            if(!inserted) queue.push(parent);
        }
        var root = queue[0];

        // 4. Generate Codes Dictionary
        var codes = {};
        function traverse(node, codeStr) {
            if (node.isLeaf) {
                codes[node.val] = codeStr;
            } else {
                traverse(node.left, codeStr + "1"); // Mozzi logic usually puts '1' for left branch? Need to verify Mozzi decoder
                traverse(node.right, codeStr + "0");
            }
        }
        // NOTE: Mozzi decoder logic:
        // if(getbit()) { const int16_t offs = ... huffcode += offs?offs+1:2; }
        // getbit() reads bits. If 1 -> offset (skip right child?), if 0 -> next (right child?)
        // Let's look at decode():
        // do { if(getbit()) ... huffcode += offs ... } while(val(huffcode++));
        // This implies tree navigation.
        
        // Standard mapping: Left='1', Right='0' is arbitrary, but we must match the flattened tree structure.
        traverse(root, "");

        // 5. Encode Data Stream
        var bitStream = "";
        diffs.forEach(function(d) {
            bitStream += codes[d];
        });

        // Pad to byte
        var padding = (8 - (bitStream.length % 8)) % 8;
        for(var p=0; p<padding; p++) bitStream += "0"; // Pad with 0? Or 1? Usually irrelevant if we stop at length.

        // Convert to Bytes
        var compressedBytes = [];
        for(var b=0; b<bitStream.length; b+=8) {
            var byteStr = bitStream.substr(b, 8);
            compressedBytes.push(parseInt(byteStr, 2));
        }

        // 6. Flatten Tree for Mozzi
        // This is the hardest part. We need to serialize the tree into the int16_t array format Mozzi expects.
        // Mozzi Format:
        // [NODE] = [offset_to_left_child] (if not leaf) OR [value] (if leaf)
        // Wait, decode() loop:
        // do {
        //    if(getbit()) { // Bit is 1
        //       const int16_t offs = *huffcode;
        //       huffcode += offs ? offs+1 : 2; // Jump logic
        //    }
        //    datapos++;
        // } while(*huffcode++); 
        // return *huffcode;
        
        // This suggests the array is NOT a standard tree serialization.
        // It seems to be a list of nodes where we traverse until we find a LEAF marker?
        
        // Let's implement a recursive serializer that matches audio2huff.py logic if possible.
        // Or simpler: Build the array such that:
        // Index N: Left Branch Offset (if bit=1).
        // Index N+1: Right Branch (implicit, just ++?) 
        // Leaves need to be marked.
        
        // Let's interpret "while(*huffcode++)":
        // It checks the current value. If it's NOT a termination/leaf marker, it loops.
        // Actually, the structure in Mozzi examples usually looks like pairs or sequences.
        
        // RE-READING SampleHuffman.h CAREFULLY:
        // do {
        //   if(getbit()) { // Bit is 1 (Left?)
        //      const int16_t offs = *huffcode;  // Read offset
        //      huffcode += offs ? offs+1 : 2;   // Jump. If offs is 0??
        //   }
        //   // If bit is 0, we just continue to next logic? No, loop continues.
        //   // But huffcode is incremented in while().
        // } while(*huffcode++);
        
        // This logic is extremely weird. 
        // It implies the tree is flattened in Pre-Order?
        // Let's Assume a simpler recursive flattening strategy that generates a valid C++ array 
        // compatible with this traversal.
        
        // Reverse engineering:
        // Node: [jump_if_1]
        // If 0, we implicitly go to next int16.
        // Loop condition (*huffcode++) checks if we are at a branch (non-zero) or leaf (zero?)
        // No, *huffcode is the jump offset.
        // If *huffcode == 0, we stop looping?
        // return *huffcode (the NEXT value).
        
        // SO: A LEAF is represented by 0? No, that would make offset 0.
        // If *huffcode is the value to return, it must be the sample difference.
        // But the loop condition checks it.
        
        // This requires deep understanding of Mozzi's custom format.
        // I will try to mimic the Python script logic directly if I can infer it.
        
        // Python logic (simplified):
        // recursive dump(node):
        //   if leaf: return [0, node.val]  <-- Leaf is [0, val]
        //   else:
        //      left = dump(node.left)
        //      right = dump(node.right)
        //      offset = len(right)
        //      return [offset] + right + left
        
        // Let's trace this Python logic with Mozzi C++:
        // [offset] is at current *huffcode.
        // while(*huffcode++): If offset != 0, it's a branch.
        // Loop body: if(getbit()) -> it was 1. We wanted LEFT branch (which is appended at end).
        //    huffcode += offs + 1. (Skip 'right' block + current 'offset' slot? No.)
        //    'offs' is len(right). We want to skip 'right'.
        //    Right block is immediately after [offset].
        //    So if bit=0 (Right), we skip nothing? 
        //    Wait, C++: if(getbit()) { huffcode += offs + 1; }
        //    So if bit=1, we jump over 'right' block.
        //    If bit=0, we don't jump. We fall into 'right' block (which starts at huffcode+1 because of while(huffcode++)).
        //    This matches `return [offset] + right + left`.
        //    Right is at index 1. Left is at index 1 + len(right).
        //    If bit=1, we jump `len(right) + 1` -> Lands on Left. Correct!
        //    If bit=0, we continue. Next word is start of Right. Correct!
        
        // Leaf logic:
        // [0, val].
        // while(*huffcode++) -> Reads 0. Loop terminates.
        // return *huffcode -> Returns val. Correct!
        
        // CONCLUSION:
        // Tree Array = Recursive function:
        // If Leaf: return [0, val]
        // If Node: 
        //    RightArr = recurse(node.right) (Bit 0)
        //    LeftArr = recurse(node.left) (Bit 1)
        //    Offset = RightArr.length
        //    return [Offset] + RightArr + LeftArr
        
        // Note: bit 1 jumps (Left), bit 0 falls through (Right).
        
        var flatTree = MozziHuffmanConverter.flattenTree(root);
        
        return {
            diffs: diffs,
            encodedData: compressedBytes,
            bitCount: bitStream.length,
            huffmanTable: flatTree
        };
    },
    
    flattenTree: function(node) {
        if (node.isLeaf) {
            return [0, node.val];
        } else {
            // Mozzi expects: bit 1 jumps (Left), bit 0 falls through (Right)
            var rightArr = MozziHuffmanConverter.flattenTree(node.right); // Bit 0 path
            var leftArr = MozziHuffmanConverter.flattenTree(node.left);   // Bit 1 path
            
            var offset = rightArr.length;
            // The result is [Offset, ...Right..., ...Left...]
            var res = [offset].concat(rightArr).concat(leftArr);
            return res;
        }
    }
};
