
// ----------------------------------------------------------

const DEFAULT_DATA = [
  {
    text: 'Film',
    href: '#film',
    selectable: false,
    icon: 'glyphicon glyphicon-film',
    tags: [ '4' ],
    nodes: [
      {
        text: 'Signal',
        href: '#signal',
        selectable: false,
        icon: 'glyphicon glyphicon-signal',
        tags: [ '2' ],
        nodes: [
          {
            text: 'Road',
            href: '#road',
            icon: 'glyphicon glyphicon-road',
            tags: [ '0' ]
          },
          {
            text: 'Inbox',
            href: '#inbox',
            icon: 'glyphicon glyphicon-inbox',
            tags: [ '0' ]
          }
        ]
      },
      {
        text: 'Music',
        href: '#music',
        icon: 'glyphicon glyphicon-music',
        tags: [ '0' ]
      }
    ]
  },
  {
    text: 'Barcode',
    href: '#barcode',
    icon: 'glyphicon glyphicon-barcode',
    tags: [ '0' ]
  },
  {
    text: 'Headphones',
    href: '#headphones',
    icon: 'glyphicon glyphicon-headphones',
    tags: [ '0' ]
  },
  {
    text: 'Tags',
    href: '#tags',
    icon: 'glyphicon glyphicon-tags',
    tags: [ '0' ]
  },
  {
    text: 'Time',
    href: '#time',
    icon: 'glyphicon glyphicon-time',
    tags: [ '0' ]
  }
]

// ----------------------------------------------------------

const ALTERNATE_DATA = [
  {
    text: 'Earphone',
    icon: 'glyphicon glyphicon-earphone',
    href: '#demo',
    tags: [ '11' ]
  },
  {
    text: 'Phone',
    selectable: false,
    icon: 'glyphicon glyphicon-phone',
    href: '#phone',
    tags: [ '2' ],
    nodes: [
      {
        text: 'User',
        selectable: false,
        icon: 'glyphicon glyphicon-user',
        href: '#user',
        tags: [ '3' ],
        nodes: [
          {
            text: 'Music',
            icon: 'glyphicon glyphicon-music',
            href: '#music',
            tags: [ '6' ]
          },
          {
            text: 'Glass',
            icon: 'glyphicon glyphicon-glass',
            href: '#glass',
            tags: [ '3' ]
          }
        ]
      },
      {
        text: 'Print',
        icon: 'glyphicon glyphicon-print',
        href: '#print',
        tags: [ '3' ]
      }
    ]
  },
  {
    text: 'Cloud',
    icon: 'glyphicon glyphicon-cloud',
    href: '#cloud',
    tags: [ '7' ]
  },
  {
    text: 'Cloud',
    icon: 'glyphicon glyphicon-cloud-download',
    href: '/demo.html',
    tags: [ '19' ],
    selected: true
  },
  {
    text: 'Certificate',
    icon: 'glyphicon glyphicon-certificate',
    color: 'pink',
    backColor: 'red',
    href: 'http://www.tesco.com',
    tags: [ 'available', '0' ]
  }
]

// ----------------------------------------------------------

window.DATA_SETS = {
  DEFAULT_DATA,
  ALTERNATE_DATA
}
