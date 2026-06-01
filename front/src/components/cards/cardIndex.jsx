import CardV1 from "./cardV1.jsx";
import CardV2 from "./cardV2.jsx";
import CardV3 from "./cardV3.jsx";
import CardV4 from "./cardV4.jsx";


function CardIndex({value, variant = 'v1'}) {

    if (variant === 'v1') {
        return <CardV1 slug={value.slug} image={value.image} title={value.title} created_at={value.created_at}/>
    } else if (variant === 'v2') {
        return (
            <CardV2 slug={value.slug} title={value.title} image={value.image} content={value.content} created_at={value.created_at}/>
        );

    }else if(variant === 'v3') {
        return <CardV3 slug={value.slug} title={value.title} image={value.image} created_at={value.created_at}/>
    }else if(variant === 'v4') {
        return <CardV4 id={value.id} title={value.title} image={value.image} created_at={value.created_at} />
    }
    else {
        return <p>Wrong variant</p>
    }
}

export default CardIndex;
