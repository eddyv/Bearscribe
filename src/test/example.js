function add_two_numbers_split_string(a, b) {
    function split_string(s) {
        return s.split('');
    }
    return split_string(a).length + split_string(b).length;
}