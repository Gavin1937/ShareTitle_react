import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';


function SearchBar(prop) {
  let trigger = [
    "#",
    "#order:", "#parent_child:",
    "#is_visited:", "#time_until:"
  ];
  let options = {
    "#": [
      "page:", "order:",
      "id:", "title:", "rtitle:",
      "url:", "rurl:", "domain:",
      "parent_child:", "is_visited:",
      "time_until:"
    ],
    "#order:": ["ASC", "DESC"],
    "#parent_child:": ["parent", "child"],
    "#is_visited:": ["unvisited", "visited", "all"],
    "#time_until:": ["now"]
  };
  
  function handleOnSelect(trig, opt) {
    trig = trig.trim();
    opt = opt.trim();
    if (
      opt === "order:" ||
      opt === "parent_child:" ||
      opt === "is_visited:" ||
      opt === "time_until:"
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
