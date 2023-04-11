import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';


function SearchBar(prop) {
  let trigger = [
    "#",
    "#order:", "#parent_child:",
    "#is_visited:",
    "#time_until:", "#time_after:"
  ];
  let options = {
    "#": [
      "page:", "limit:", "order:",
      "id:",
      "id_greater_then:", "id_greater_eq:", 
      "id_less_then:", "id_less_eq:",
      "title:", "rtitle:",
      "url:", "rurl:", "domain:",
      "parent_child:", "is_visited:",
      "time_until:", "time_after:"
    ],
    "#order:": ["ASC", "DESC"],
    "#parent_child:": ["parent", "child", "all"],
    "#is_visited:": ["unvisited", "visited", "all"],
    "#time_until:": ["now"],
    "#time_after:": ["now"]
  };
  
  function handleOnSelect(trig, opt) {
    trig = trig.trim();
    opt = opt.trim();
    if (
      opt === "order:" ||
      opt === "parent_child:" ||
      opt === "is_visited:" ||
      opt === "time_until:" ||
      opt === "time_after:"
    ) {
      return trig+opt.substr(0,opt.length-1);
    }
    else if (trig[0] === "#" && trig.length > 1) {
      return trig+opt+" ";
    }
    return trig+opt;
  }
  
  return (
    <div className="SearchBar">
      <TextInput
        Component={"input"}
        disabled={prop.disabled}
        changeOnSelect={handleOnSelect}
        trigger={trigger} options={options}
        maxOptions={10} spacer={""}
        style={{width:prop.width, height:prop.height, resize:"none"}}
      />
    </div>
  );
}

export default SearchBar;
