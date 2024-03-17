local function rec_to_map(rec)
  local xrec = map()
  for i, bin_name in ipairs(record.bin_names(rec)) do
      xrec[bin_name] = rec[bin_name]
  end
  return xrec
end

function str_between(stream, bin_name, filter_name, startValue, endValue)

 

  local function range_filter(rec)
     local counter = rec["cT"]
     local val = rec[bin_name]
     if val == filter_name and (counter >= startValue and counter <= endValue) then
        return true
     else
        return false
     end
  end
  return stream:filter(range_filter):map(rec_to_map)
end
